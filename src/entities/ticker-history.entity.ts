import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "ticker_ask_history" })
export class TickerAskRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  price: number;

  @Column({ type: "int" })
  whole_lot_volume: number;

  @Column({ type: "double" })
  lot_volume: number;
}

@Entity({ name: "ticker_bid_history" })
export class TickerBidRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  price: number;

  @Column({ type: "int" })
  whole_lot_volume: number;

  @Column({ type: "double" })
  lot_volume: number;
}

@Entity({ name: "ticker_last_trade_history" })
export class TickerLastTradeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  price: number;

  @Column({ type: "double" })
  lot_volume: number;
}

@Entity({ name: "ticker_volume_history" })
export class TickerVolumeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  today: number;

  @Column({ type: "double" })
  last_24_hr: number;
}

@Entity({ name: "ticker_volume_weighted_avg_price_history" })
export class TickerVolumeWeightedAvgPriceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  today: number;

  @Column({ type: "double" })
  last_24_hr: number;
}

@Entity({ name: "ticker_trade_count_history" })
export class TickerTradeCountRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  today: number;

  @Column({ type: "double" })
  last_24_hr: number;
}

@Entity({ name: "ticker_low_history" })
export class TickerLowRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  today: number;

  @Column({ type: "double" })
  last_24_hr: number;
}

@Entity({ name: "ticker_high_history" })
export class TickerHighRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  today: number;

  @Column({ type: "double" })
  last_24_hr: number;
}

@Entity({ name: "ticker_history" })
export class TickerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @CreateDateColumn()
  time: Date;

  @Column({ type: "double" })
  open: number;

  @OneToOne(() => TickerAskRecord, { eager: true, cascade: true })
  @JoinColumn()
  ask: TickerAskRecord;

  @OneToOne(() => TickerBidRecord, { eager: true, cascade: true })
  @JoinColumn()
  bid: TickerBidRecord;

  @OneToOne(() => TickerLastTradeRecord, { eager: true, cascade: true })
  @JoinColumn()
  lastClosed: TickerLastTradeRecord;

  @OneToOne(() => TickerVolumeRecord, { eager: true, cascade: true })
  @JoinColumn()
  volume: TickerVolumeRecord;

  @OneToOne(() => TickerVolumeWeightedAvgPriceRecord, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  volWghtAvgPrice: TickerVolumeWeightedAvgPriceRecord;

  @OneToOne(() => TickerTradeCountRecord, { eager: true, cascade: true })
  @JoinColumn()
  tradeCount: TickerTradeCountRecord;

  @OneToOne(() => TickerLowRecord, { eager: true, cascade: true })
  @JoinColumn()
  low: TickerLowRecord;

  @OneToOne(() => TickerHighRecord, { eager: true, cascade: true })
  @JoinColumn()
  high: TickerHighRecord;
}
