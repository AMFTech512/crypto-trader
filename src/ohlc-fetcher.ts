import { getRepository, In } from "typeorm";
import { getOHLC } from "./api/kraken.api";
import {
  generateOHLCIDString,
  OHLCID,
  OHLCRecord,
} from "./entities/ohlc-history.entity";

export function buildOHLCFetcher(tickers: string[]) {
  return async () => {
    // console.log("Fetching OHLC");
    // const symbol = "ohlcfetcher";
    // console.time(symbol);

    const fetchedOHLC = (
      await Promise.all(tickers.map((ticker) => getOHLC(ticker)))
    ).flat();

    const ohlcRepo = getRepository(OHLCRecord);

    const newIds = fetchedOHLC.map((ohlc) =>
      generateOHLCIDString(ohlc.id as OHLCID)
    );

    const existingIds = new Set(
      (
        await ohlcRepo
          .createQueryBuilder("record")
          .where("record.id IN (:...ids)", { ids: newIds })
          .getMany()
      ).map((ohlc) => generateOHLCIDString(ohlc.id as OHLCID))
    );

    const ohlcToSave = fetchedOHLC.filter(
      (ohlc) => !existingIds.has(generateOHLCIDString(ohlc.id as OHLCID))
    );

    // console.log("records to save:", ohlcToSave.length);

    if (ohlcToSave.length < 1) {
      // console.timeEnd(symbol);
      return [];
    }

    const savedOHLCs = await ohlcRepo.save(ohlcToSave, { chunk: 100 });

    // console.timeEnd(symbol);

    return savedOHLCs;
  };
}
