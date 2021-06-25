import axios, { AxiosResponse } from "axios";
import { OHLCRecord } from "../entities/ohlc-history.entity";
import {
  TickerRecord,
  TickerAskRecord,
  TickerBidRecord,
  TickerLastTradeRecord,
  TickerVolumeRecord,
  TickerVolumeWeightedAvgPriceRecord,
  TickerTradeCountRecord,
  TickerLowRecord,
  TickerHighRecord,
} from "../entities/ticker-history.entity";
import { axiosRequest } from "../helpers/axios-request";

const baseURL = "https://api.kraken.com/0/";

export async function getTicker(ticker: string) {
  // from https://docs.kraken.com/rest/#operation/getTickerInformation
  interface KrakenGetTickerResponse {
    error: string[];
    result: {
      [key: string]: {
        a: [
          // Ask
          string, // price
          string, // whole lot volume
          string // lot volume
        ];
        b: [
          // Bid
          string, // price
          string, // whole lot volume
          string // lot volume
        ];
        c: [
          // Last trade closed
          string, // price
          string // lot volume
        ];
        v: [
          // Volume
          string, // today
          string // last 24 hours
        ];
        p: [
          // Volume weighted average price
          string, // today,
          string // last 24 hours
        ];
        t: [
          // string of trades
          number, // today
          number // last 24 hours
        ];
        l: [
          // Low
          string, // today,
          string // last 24 hours
        ];
        h: [
          // High
          string, // today,
          string // last 24 hours
        ];
        o: string; // opening price
      };
    };
  }

  const [axiosResult, error] = await axiosRequest<KrakenGetTickerResponse>(
    axios.get("/public/Ticker", {
      baseURL,
      params: {
        pair: ticker,
      },
    })
  );

  if (error) throw JSON.stringify(error);

  const data = axiosResult.data;
  const [newKey] = Object.keys(data.result);
  const tickerData = data.result[newKey];

  if (data.error.length > 0) throw data.error;

  const tickerRecord = new TickerRecord();
  tickerRecord.ticker = ticker;
  tickerRecord.open = Number(tickerData.o);

  tickerRecord.ask = new TickerAskRecord();
  tickerRecord.ask.price = Number(tickerData.a[0]);
  tickerRecord.ask.whole_lot_volume = Number(tickerData.a[1]);
  tickerRecord.ask.lot_volume = Number(tickerData.a[2]);

  tickerRecord.bid = new TickerBidRecord();
  tickerRecord.bid.price = Number(tickerData.b[0]);
  tickerRecord.bid.whole_lot_volume = Number(tickerData.b[1]);
  tickerRecord.bid.lot_volume = Number(tickerData.b[2]);

  tickerRecord.lastClosed = new TickerLastTradeRecord();
  tickerRecord.lastClosed.price = Number(tickerData.c[0]);
  tickerRecord.lastClosed.lot_volume = Number(tickerData.c[1]);

  tickerRecord.volume = new TickerVolumeRecord();
  tickerRecord.volume.today = Number(tickerData.v[0]);
  tickerRecord.volume.last_24_hr = Number(tickerData.v[1]);

  tickerRecord.volWghtAvgPrice = new TickerVolumeWeightedAvgPriceRecord();
  tickerRecord.volWghtAvgPrice.today = Number(tickerData.p[0]);
  tickerRecord.volWghtAvgPrice.last_24_hr = Number(tickerData.p[1]);

  tickerRecord.tradeCount = new TickerTradeCountRecord();
  tickerRecord.tradeCount.today = Number(tickerData.t[0]);
  tickerRecord.tradeCount.last_24_hr = Number(tickerData.t[1]);

  tickerRecord.low = new TickerLowRecord();
  tickerRecord.low.today = Number(tickerData.l[0]);
  tickerRecord.low.last_24_hr = Number(tickerData.l[1]);

  tickerRecord.high = new TickerHighRecord();
  tickerRecord.high.today = Number(tickerData.h[0]);
  tickerRecord.high.last_24_hr = Number(tickerData.h[1]);

  return tickerRecord;
}

export async function getOHLC(
  ticker: string,
  interval?: number,
  since?: number
) {
  type OHLCDTO = [
    number, // time
    string, // open
    string, // high
    string, // low
    string, // close
    string, // vwap (volume weighted average price)
    string, // volume
    number // count
  ];

  interface KrakenGetOHLCResponse {
    error: string[];
    result: {
      [key: string]: OHLCDTO[] | number;
      last: number;
    };
  }

  // add any optional parameters
  const params: any = { pair: ticker };
  if (interval) params.interval = interval;
  if (since) params.since = since;

  const [axiosResult, error] = await axiosRequest(
    axios.get<KrakenGetOHLCResponse>("/public/OHLC", {
      baseURL,
      params,
    })
  );

  if (error) throw JSON.stringify(error);

  const data = axiosResult.data;

  if (!data?.result) {
    console.error(`Received empty object for ticker ${ticker}. Skipping...`);
    return [];
  }

  const [newKey] = Object.keys(data.result).filter((key) => key !== "last");
  const ohlcArr = data.result[newKey];

  if (data.error.length > 0) throw data.error;

  const createOHLCRecord = (ohlc: OHLCDTO) => {
    const record = new OHLCRecord();

    record.ticker = ticker;
    record.time_seconds = Number(ohlc[0]);
    record.open = Number(ohlc[1]);
    record.high = Number(ohlc[2]);
    record.low = Number(ohlc[3]);
    record.close = Number(ohlc[4]);
    record.vwap = Number(ohlc[5]);
    record.volume = Number(ohlc[6]);
    record.count = Number(ohlc[7]);

    record.id = [ticker, record.time_seconds];

    return record;
  };

  const ohlcRecords = (ohlcArr as OHLCDTO[]).map(createOHLCRecord);

  return ohlcRecords;
}
