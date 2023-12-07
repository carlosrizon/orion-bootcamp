import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Entity
} from 'typeorm';
import User from './User';

@Entity('surveys')
export default class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, default: null })
  comment: string;

  @Column({ type: 'int', nullable: false })
  grade: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, default: false })
  answered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
