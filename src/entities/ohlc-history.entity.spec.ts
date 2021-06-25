import { getConnection, getRepository, Repository } from "typeorm";
import { initTestDB } from "../../src/db";
import { OHLCRecord } from "./ohlc-history.entity";

describe("OHLCRecord [Entity]", () => {
  let ohlcRepo: Repository<OHLCRecord>;

  beforeEach(async () => {
    await initTestDB();
    ohlcRepo = getRepository(OHLCRecord);
  });

  afterEach(async () => {
    let conn = getConnection();
    return conn.close();
  });

  it("should save an OHLC object", async () => {
    const record = new OHLCRecord();

    record.ticker = "ETHUSD";
    record.time = new Date();

    record.open = 1;
    record.high = 2;
    record.low = 3;
    record.close = 4;
    record.vwap = 5;
    record.count = 6;

    await ohlcRepo.save(record);
  });

  it("should not read any objects from any previous tests", async () => {
    const records = await ohlcRepo.find();

    expect(records.length).toBe(0);
  });
});
