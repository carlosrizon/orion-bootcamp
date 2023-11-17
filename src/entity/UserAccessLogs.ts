import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert
} from 'typeorm';

import User from './User';

/**
 * Entidade com informações relacionadas a acessos (logins bem-sucedidos) de usuários
 */
@Entity('user_access_logs')
export class UserAccessLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  accessDate: Date;

  @BeforeInsert()
  logDate() {
    this.accessDate = new Date();
  }
}
