import { getRepository } from "typeorm";
import { getTicker } from "./api/kraken.api";
import { TickerRecord } from "./entities/ticker-history.entity";

export interface TickerFetcherOptions {
  /** Which tickers the ticker fetcher should fetch. */
  tickers: string[];

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

export class TickerFetcher {
  enabled: boolean = false;
  tickers: string[] = [];
  interval: number = 1000;
  retryCount: number = -1;

  private _isRunning: boolean = false;
  private _onStopFuncs: (() => any)[] = [];

  constructor(options: TickerFetcherOptions) {
    // initialize properties
    this.tickers = options.tickers;
    if (options.interval) this.interval = options.interval;
    if (options.retryCount !== undefined) this.retryCount = options.retryCount;

    if (options.startImmediately) this.start();
  }

  start() {
    this._fetchTickersLoop().catch((error) => {
      switch (error) {
        case TickerFetcherErrors.ReachedMaxRetries:
          console.error(
            "Ticker fetcher reached the maximum number of allowed consecutive retries. Terminating fetch cycle."
          );
          break;

        default:
          console.error(
            "An unknown fatal error occurred while fetching tickers. Terminating fetch cycle."
          );
      }

      this.stop();
    });
  }

  async stop() {
    this.enabled = false;

    while (this._isRunning) {
      await new Promise((res) => setTimeout(res, 100));
    }

    for (const func of this._onStopFuncs) await func();

    console.log("Ticker fetcher gracefully terminated.");
  }

  onStop(func: () => any) {
    this._onStopFuncs.push(func);
  }

  private async _fetchAndSaveTickers() {
    const tickersToSave = await Promise.all(
      this.tickers.map((ticker) => getTicker(ticker))
    );
    const tickerRepo = getRepository(TickerRecord);
    const savedTickers = await tickerRepo.save(tickersToSave);

    return savedTickers;
  }

  private async _fetchTickersLoop() {
    let failCount = 0;

    // we want to run this loop until someone tells us to stop
    this.enabled = true;
    while (this.enabled) {
      // console.log("Fetching tickers");

      this._isRunning = true;

      try {
        await this._fetchAndSaveTickers();
        failCount = 0;
      } catch (error) {
        this._isRunning = false;
        failCount++;

        console.error("An error occurred while fetching:", error);

        if (this.retryCount > -1 && failCount > this.retryCount)
          throw TickerFetcherErrors.ReachedMaxRetries;

        console.error("Attempting to restart ticker fetch cycle");
      }

      await new Promise((res) => setTimeout(res, this.interval));
    }

    this._isRunning = false;
  }
}
