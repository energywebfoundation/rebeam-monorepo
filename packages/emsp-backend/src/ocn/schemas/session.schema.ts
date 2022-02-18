import { ICdrToken, IChargingPeriod, IPrice } from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'timestamptz' })
  start_date_time: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date_time: Date;

  @Column()
  kwh: number;

  @Column({ type: 'json' })
  cdr_token: ICdrToken;

  @Column()
  auth_method: string;

  @Column({ nullable: true })
  authorization_method: string;

  @Column()
  location_id: string;

  @Column()
  evse_uid: string;

  @Column()
  connector_id: string;

  @Column({ nullable: true })
  meter_id: string;

  @Column({ type: 'json' })
  charging_periods: IChargingPeriod[];

  @Column({ type: 'json' })
  total_cost: IPrice;

  @Column()
  status: string;

  @Column({ type: 'timestamptz' })
  last_updated: Date;
}
