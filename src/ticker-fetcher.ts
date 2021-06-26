import { getRepository } from "typeorm";
import { getTicker } from "./api/kraken.api";
import { TickerRecord } from "./entities/ticker-history.entity";

export function buildTickerFetcher(tickers: string[]) {
  return async () => {
    // console.log("Fetching tickers");
    // const symbol = "tickerfetcher";
    // console.time(symbol);

    const tickersToSave = await Promise.all(
      tickers.map((ticker) => getTicker(ticker))
    );
    const tickerRepo = getRepository(TickerRecord);
    const savedTickers = await tickerRepo.save(tickersToSave);

    // console.timeEnd(symbol);

    return savedTickers;
  };
}
