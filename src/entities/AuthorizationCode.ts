import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuthorizationCode {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  clientId!: string;

  @Column()
  redirectUri!: string;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
