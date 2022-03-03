import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  country_code: string;

  @Column()
  party_id: string;

  @Column()
  uid: string;

  @Column()
  type: string;

  @Column()
  contract_id: string;

  @Column({ nullable: true })
  visual_number: string;

  @Column()
  issuer: string;

  @Column({ nullable: true })
  group_id: string;

  @Column()
  valid: boolean;

  @Column()
  whitelist: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  default_profile_type: string;

  @Column({ type: 'json', nullable: true })
  energy_contract: {
    supplier_name: string;
    contract_id?: string;
  };

  @Column({ type: 'timestamptz' })
  last_updated: Date;
}
