import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OHLCRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column({ type: "datetime" })
  time: Date;

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

  @Column({ type: "int" })
  count: number;
}
