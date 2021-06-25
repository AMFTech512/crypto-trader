import { getOHLC, getTicker } from "./kraken.api";

describe("Kraken API", () => {
  describe("getTicker()", () => {
    it("should get ticker data for BTCUSD", async () => {
      const tickerRecord = await getTicker("BTCUSD");
      console.log(tickerRecord);
    });

    it("should get ticker data for ETHUSD", async () => {
      const tickerRecord = await getTicker("ETHUSD");
      console.log(tickerRecord);
    });
  });

  describe("getOHLC()", () => {
    it("should get OHLC data for BTCUSD", async () => {
      const ohlcRecords = await getOHLC("BTCUSD");
      // console.log(ohlcRecords);
    });

    it("should get OHLC data for ETHUSD", async () => {
      const ohlcRecords = await getOHLC("ETHUSD");
      // console.log(ohlcRecords);
    });
  });
});
