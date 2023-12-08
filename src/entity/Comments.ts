import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import User from './User';
import { Category } from '../utils/cardsMetricsUtils';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 300 })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'enum', enum: Category })
  category: string;
}
