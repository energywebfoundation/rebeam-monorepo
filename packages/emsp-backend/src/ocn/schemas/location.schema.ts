import {
  IAdditionalGeoLocation,
  IBusinessDetails,
  IDisplayText,
  IEnergyMix,
  IGeoLocation,
  IHours,
  IImage,
  IPublishTokenType,
} from '@energyweb/ocn-bridge';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  country_code: string;

  @Column()
  party_id: string;

  @Column()
  id: string;

  @Column()
  publish: boolean;

  @Column({ type: 'json', nullable: true })
  publish_allowed_to: IPublishTokenType[];

  @Column({ nullable: true })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  country: string;

  @Column({ type: 'json' })
  coordinates: IGeoLocation;

  @Column({ type: 'json', nullable: true })
  related_locations: IAdditionalGeoLocation[];

  @Column({ nullable: true })
  parking_type: string;

  // TODO: one to many evses

  @Column({ type: 'json', nullable: true })
  directions: IDisplayText[];

  @Column({ type: 'json', nullable: true })
  operator: IBusinessDetails;

  @Column({ type: 'json', nullable: true })
  suboperator: IBusinessDetails;

  @Column({ type: 'json', nullable: true })
  owner: IBusinessDetails;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column()
  time_zone: string;

  @Column({ type: 'json', nullable: true })
  opening_times: IHours;

  @Column({ nullable: true })
  charging_when_closed: boolean;

  @Column({ type: 'json', nullable: true })
  images: IImage[];

  @Column({ type: 'json', nullable: true })
  energy_mix: IEnergyMix;

  @Column({ type: 'timestamptz' })
  last_updated: Date;
}
