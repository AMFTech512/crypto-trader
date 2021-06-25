import { getRepository } from "typeorm";
import { getTicker } from "./api/kraken.api";
import { TickerRecord } from "./entities/ticker-history.entity";

export function buildTickerFetcher(tickers: string[]) {
  return async () => {
    const tickersToSave = await Promise.all(
      tickers.map((ticker) => getTicker(ticker))
    );
    const tickerRepo = getRepository(TickerRecord);
    const savedTickers = await tickerRepo.save(tickersToSave);

    return savedTickers;
  };
}
