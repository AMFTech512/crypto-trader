import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

type OHLCID = [string, number];

const generateOHLCIDString = ([ticker, time]: OHLCID) => `${ticker}_${time}`;
const generateOHLCIDArr = (value: string) => {
  const [ticker, time] = value.split("_");
  return [ticker, Number(time)];
};

@Entity()
export class OHLCRecord {
  @PrimaryColumn({
    type: "varchar",
    length: 32,
    transformer: {
      from: generateOHLCIDArr,
      to: generateOHLCIDString,
    },
  })
  id: string | OHLCID;

  /** The id but also the time in seconds */
  @Column()
  time_seconds: number;

  get time(): Date {
    // convert it to milliseconds and return a new Date object
    return new Date(this.time_seconds * 1000);
  }

  @Column()
  ticker: string;

  @Column({ type: "float" })
  open: number;

  @Column({ type: "float" })
  high: number;

  @Column({ type: "float" })
  low: number;

  @Column({ type: "float" })
  close: number;

  @Column({ type: "float" })
  vwap: number;

  @Column({ type: "float" })
  volume: number;

  @Column({ type: "int" })
  count: number;
}
