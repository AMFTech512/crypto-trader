import { getConnection } from "typeorm";
import { initDB } from "./db";
import { Looper } from "./looper";
import { buildOHLCFetcher } from "./ohlc-fetcher";
import { buildTickerFetcher } from "./ticker-fetcher";
import { USDTickers } from "./tickers/usd-tickers";

console.log("Starting Crypto trader...");

async function init() {
  await initDB();

  const tickers = [
    USDTickers.Ethereum,
    USDTickers.EthereumClassic,
    USDTickers.Bitcoin,
    USDTickers.Dogecoin,
    USDTickers.Litecoin,
  ];

  const looper = new Looper({
    functions: [buildTickerFetcher(tickers), buildOHLCFetcher(tickers)],
    interval: 2000,
    retryCount: 10,
  });

  const closeDB = async () => {
    const dbConnection = getConnection();
    if (dbConnection.isConnected) {
      await dbConnection.close();
      console.log("Database connection closed.");
    }
  };

  const onTerminate = async (signal: string) => {
    console.log(`Received ${signal}; terminating program...`);

    await looper.stop();
    await closeDB();
  };

  process.on("SIGINT", onTerminate);
  process.on("SIGTERM", onTerminate);

  looper.onStop(closeDB);
  looper.start();
}

init().catch((error) => {
  console.error(error);
});
