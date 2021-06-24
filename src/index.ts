import { getConnection } from "typeorm";
import { initDB } from "./db";
import { TickerFetcher } from "./ticker-fetcher";
import { USDTickers } from "./tickers/usd-tickers";

console.log("Starting Crypto trader...");

async function init() {
  await initDB();

  const tickerFetcher = new TickerFetcher({
    tickers: [
      USDTickers.Ethereum,
      USDTickers.EthereumClassic,
      USDTickers.Bitcoin,
      USDTickers.Dogecoin,
      USDTickers.Litecoin,
    ],
    interval: 2000,
    retryCount: 10,
  });

  const onTerminate = async (signal: string) => {
    console.log(`Received ${signal}; terminating program...`);

    await tickerFetcher.stop();

    const dbConnection = getConnection();
    dbConnection.close();
    console.log("Database connection closed.");
  };

  process.on("SIGINT", onTerminate);
  process.on("SIGTERM", onTerminate);

  tickerFetcher.start();
}

init().catch((error) => {
  console.error(error);
});
