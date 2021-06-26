interface QueueItem {
  func: () => any;
  res: (value?: any) => void;
  rej: (error?: any) => void;
}

export class RequestQueue {
  public static maxInterval = 1000;

  private static _queue: QueueItem[] = [];

  private static _isQueueDraining = false;
  private static _lastTime = new Date().getTime();

  static queueUp<T>(func: () => T) {
    // console.log("Adding to queue");
    const prom = new Promise<T>((res, rej) => {
      RequestQueue._queue.push({
        func,
        res,
        rej,
      });
    });

    RequestQueue._drainQueue();

    return prom;
  }

  private static async _drainQueue() {
    if (RequestQueue._isQueueDraining) return;

    // console.log("Draining queue");
    RequestQueue._isQueueDraining = true;

    while (RequestQueue._queue.length > 0) {
      // ensure a somewhat consistent execution interval
      // compute when we can execute our next task
      const latestTime = RequestQueue._lastTime + RequestQueue.maxInterval;
      const now = new Date().getTime();
      // compute the amount of time we have to wait
      const timeToWait = latestTime - now;
      // wait for that long
      await new Promise((res) => setTimeout(res, Math.max(timeToWait, 0)));
      // make a note of when we finished waiting
      RequestQueue._lastTime = new Date().getTime();

      // extract the first item from our queue
      const { func, res, rej } = RequestQueue._queue.shift();

      try {
        // resolve the value returned by our function
        res(await func());
      } catch (error) {
        // or if there's an error, reject it
        rej(error);
      }
    }

    // console.log("Queue drained");
    RequestQueue._isQueueDraining = false;
  }
}
