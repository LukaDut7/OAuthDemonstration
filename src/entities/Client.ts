import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  clientId!: string;

  @Column()
  redirectUri!: string;
}
