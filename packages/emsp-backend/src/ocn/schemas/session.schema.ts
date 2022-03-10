import { ICdrToken, IChargingPeriod, IPrice } from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils';
@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  _id: number;
  @Column()
  country_code: string;
  @Column()
  party_id: string;
  @Column()
  id: string;
  @Column({ nullable: true })
  session_token: string;
  @Column({ nullable: true })
  currency: string;
  @Column({ type: 'timestamptz' })
  start_date_time: Date;
  @Column({ type: 'timestamptz', nullable: true })
  end_date_time: Date;
  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  kwh: number;
  @Column({ type: 'json' })
  cdr_token: ICdrToken;
  @Column({ nullable: true })
  auth_method: string;
  @Column({ nullable: true })
  authorization_method: string;
  @Column()
  location_id: string;
  @Column()
  evse_uid: string;
  @Column({ nullable: true })
  connector_id: string;
  @Column({ nullable: true })
  meter_id: string;
  @Column({ type: 'json', nullable: true })
  charging_periods: IChargingPeriod[];
  @Column({ type: 'json', nullable: true })
  total_cost: IPrice;
  @Column({ nullable: true })
  status: string;
  @Column({ type: 'timestamptz' })
  last_updated: Date;
}
