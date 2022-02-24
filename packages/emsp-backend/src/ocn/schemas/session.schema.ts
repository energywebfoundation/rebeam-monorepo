import { IPrice } from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  id: string;

  @Column()
  kwh: number;

  @Column({ type: 'json' })
  total_cost: IPrice;

  @Column()
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_updated: Date;

  @Column({ type: 'timestamptz', nullable: true })
  start_date_time: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date_time: Date;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  party_id: string;

  @Column({ nullable: true })
  connector_id: string;

  @Column({ nullable: true })
  currency: string;
}
