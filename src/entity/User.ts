import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import Survey from './Survey';
import UserAccessLog from './UserAccessLog';

/**
 * Entidade com informações relacionadas aos usuários da aplicação
 */
@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  lastName: string;

  @Column({ type: 'varchar', length: 30 })
  gender: string;

  @Column()
  birthDate: Date;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @OneToMany(() => Survey, (survey) => survey.user)
  surveys: Array<Survey>;

  @OneToMany(() => UserAccessLog, (user_access_log) => user_access_log.user)
  logins: Array<UserAccessLog>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdate: Date;

  @Column({ default: false })
  isActivated: boolean;
}
