import { getRepository } from "typeorm";
import { getTicker } from "./api/kraken.api";
import { TickerRecord } from "./entities/ticker-history.entity";

export interface TickerFetcherOptions {
  /** Which tickers the ticker fetcher should fetch. */
  functions?: (() => any)[];

  /** Whether or not the TickerFetcher should start trying to fetch immediately. Default: false */
  startImmediately?: boolean;

  /** Measured in milliseconds. Default: 1000. */
  interval?: number;

  /** How many times the TickerFetcher is allowed to retry a fetch before it gives up. If -1, it tries forever. Default: -1 */
  retryCount?: number;
}

enum TickerFetcherErrors {
  ReachedMaxRetries,
}

export class Looper {
  interval: number = 1000;
  retryCount: number = -1;

  private _isRunning: boolean = false;
  private _enabled: boolean = false;
  private _onStopFuncs: (() => any)[] = [];
  private _functions: (() => any)[] = [];

  constructor(options: TickerFetcherOptions) {
    // initialize properties
    if (options.interval) this.interval = options.interval;
    if (options.retryCount !== undefined) this.retryCount = options.retryCount;
    if (options.functions) this._functions = options.functions;

    if (options.startImmediately) this.start();
  }

  /**
   * Registers a new function in the loop.
   * Returns a method that will unregister the function when called.
   */
  registerFunction(func: () => any) {
    const ind = this._functions.push(func) - 1;
    const unregisterFunc = () => this._functions.splice(ind, 1);

    return unregisterFunc;
  }

  start() {
    this._loop().catch((error) => {
      switch (error) {
        case TickerFetcherErrors.ReachedMaxRetries:
          console.error(
            "Looper reached the maximum number of allowed consecutive retries. Terminating fetch cycle."
          );
          break;

        default:
          console.error(
            "An unknown fatal error occurred while looping. Terminating fetch cycle."
          );
      }

      this.stop();
    });
  }

  async stop() {
    this._enabled = false;

    // wait until our loop has stopped
    while (this._isRunning) await new Promise((res) => setTimeout(res, 100));

    // trigger all of the onStop listeners
    for (const func of this._onStopFuncs) await func();

    console.log("Looper gracefully terminated.");
  }

  onStop(func: () => any) {
    this._onStopFuncs.push(func);
  }

  private async _loop() {
    let failCount = 0;

    // we want to run this loop until someone tells us to stop
    this._enabled = true;
    while (this._enabled) {
      this._isRunning = true;

      try {
        // run each of the functions we have
        for (const func of this._functions) await func();

        failCount = 0;
      } catch (error) {
        this._isRunning = false;
        failCount++;

        console.error("An error occurred while looping:", error);

        if (this.retryCount > -1 && failCount > this.retryCount)
          throw TickerFetcherErrors.ReachedMaxRetries;

        console.error("Attempting to restart looper...");
      }

      await new Promise((res) => setTimeout(res, this.interval));
    }

    this._isRunning = false;
  }
}
