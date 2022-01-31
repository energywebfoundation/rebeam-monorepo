import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column()
  role: string;

  @Column()
  url: string;
}
