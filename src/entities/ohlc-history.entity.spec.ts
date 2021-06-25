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
    const time = Math.floor(new Date().getTime() / 1000);

    const record = new OHLCRecord();

    record.id = ["ETHUSD", time];
    // record.id = "what the fuck";
    record.ticker = "ETHUSD";
    record.time_seconds = time;

    record.open = 1;
    record.high = 2;
    record.low = 3;
    record.close = 4;
    record.vwap = 5;
    record.volume = 6;
    record.count = 7;

    expect(record.time).toBeInstanceOf(Date);

    await ohlcRepo.save(record);
    await ohlcRepo.save(record);

    // const record1 = new OHLCRecord();

    // record1.id = ["ETHUSD", time];
    // record1.ticker = "ETHUSD";
    // record1.time_seconds = time;

    // record1.open = 1;
    // record1.high = 2;
    // record1.low = 3;
    // record1.close = 4;
    // record1.vwap = 5;
    // record1.volume = 6;
    // record1.count = 7;

    // expect(record1.time).toBeInstanceOf(Date);

    // await ohlcRepo.save(record1);
  });

  it("should not read any objects from any previous tests", async () => {
    const records = await ohlcRepo.find();

    expect(records.length).toBe(0);
  });
});
