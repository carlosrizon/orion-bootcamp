import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column
} from 'typeorm';
import User from './User';

/**
 * Entidade com informações relacionadas aos pagamentos efetuados pelos usuários {@link User} na aplicação
 */
@Entity('payments')
export default class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  paymentId: number;

  @Column({ type: 'varchar', length: 20, default: 'pix' })
  paymentMethod: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  email: string;

  @Column({ type: 'varchar', length: 20, default: 'created' })
  status: string;

  @Column()
  qrcode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdate: Date;
}
