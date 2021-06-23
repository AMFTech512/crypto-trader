import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "ticker_ask_price_history" })
export class TickerPriceInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  price: number;

  @Column({ type: "int" })
  whole_lot_volume: number;

  @Column({ type: "double" })
  lot_volume: number;
}

@Entity({ name: "ticker_history" })
export class TickerInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @CreateDateColumn()
  time: Date;

  @OneToOne(() => TickerPriceInstance, { eager: true, cascade: true })
  @JoinColumn()
  ask: TickerPriceInstance;
}
