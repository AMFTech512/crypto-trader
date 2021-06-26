import { getRepository } from "typeorm";
import { getOHLC } from "./api/kraken.api";
import { OHLCRecord } from "./entities/ohlc-history.entity";

export function buildOHLCFetcher(tickers: string[]) {
  return async () => {
    // console.log("Fetching OHLC");
    // const symbol = "ohlcfetcher";
    // console.time(symbol);

    const ohlcToSave = await Promise.all(
      tickers.map((ticker) => getOHLC(ticker))
    );
    const ohlcRepo = getRepository(OHLCRecord);
    const savedOHLCs = await ohlcRepo.save(ohlcToSave.flat(), { chunk: 100 });

    // console.timeEnd(symbol);

    return savedOHLCs;
  };
}
