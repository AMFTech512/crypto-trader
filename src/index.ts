import axios from "axios";
import { getRepository } from "typeorm";
import { coinbaseRequest } from "./api/coinbase.api";
import { initDB } from "./db";
import {
  TickerInstance,
  TickerPriceInstance,
} from "./entities/price-history.entity";
import { COINBASE_API_KEY, COINBASE_API_VERSION } from "./env";

console.log("Starting Crypto trader...");
console.log("Using Coinbase API version", COINBASE_API_VERSION);

async function init() {
  await initDB();

  const tickerRepo = getRepository(TickerInstance);

  const ticker = new TickerInstance();

  ticker.ticker = "ETHUSD";

  ticker.ask = new TickerPriceInstance();
  ticker.ask.lot_volume = 1.1;
  ticker.ask.whole_lot_volume = 1;
  ticker.ask.price = 10;

  await tickerRepo.save(ticker);

  // try {
  //   const res = await coinbaseRequest("GET", "/v2/prices/BTC-USD/buy");
  //   console.log(res.data);
  // } catch (error) {
  //   console.error(error.response.data);
  // }
}

init().catch((error) => {
  console.error(error);
});
