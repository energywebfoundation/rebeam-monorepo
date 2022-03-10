import {
  ICdrLocation,
  ICdrToken,
  IChargingPeriod,
  IPrice,
  ISignedData,
  ITariff,
} from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils';

@Entity()
export class ChargeDetailRecord {
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
  session_id: string;

  @Column()
  session_token: string;

  @Column({ type: 'json' })
  cdr_token: ICdrToken;

  @Column({ nullable: true })
  auth_method: string;

  @Column({ nullable: true })
  authorization_reference: string;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'json' })
  cdr_location: ICdrLocation;

  @Column({ nullable: true })
  meter_id: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'json', nullable: true })
  charging_periods?: IChargingPeriod[];

  @Column({ type: 'json', nullable: true })
  tariffs: ITariff[];

  @Column({ type: 'json', nullable: true })
  signed_data: ISignedData;

  @Column({ type: 'json', nullable: true })
  total_cost: IPrice;

  @Column({ type: 'json', nullable: true })
  total_fixed_cost: IPrice;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total_energy: number;

  @Column({ type: 'json', nullable: true })
  total_energy_cost: IPrice;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total_time: number;

  @Column({ type: 'json', nullable: true })
  total_time_cost: IPrice;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  total_parking_time: number;

  @Column({ type: 'json', nullable: true })
  total_parking_cost: IPrice;

  @Column({ type: 'json', nullable: true })
  total_reservation_cost: IPrice;

  @Column({ nullable: true })
  remark: string;

  @Column({ nullable: true })
  invoice_reference_id: string;

  @Column({ nullable: true })
  credit: boolean;

  @Column({ nullable: true })
  credit_reference_id: string;

  @Column({ nullable: true })
  last_updated: string;
}
