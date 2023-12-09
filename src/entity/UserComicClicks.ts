import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

import Comic from './Comic';
import User from './User';

/**
 * Entidade com informações de cliques por usuário {@link User} por card de quadrinho {@link Comic}
 */
@Entity('user_comic_clicks')
export class UserComicClicks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Comic)
  @JoinColumn({ name: 'comic_id' })
  comic: Comic;

  @Column({ type: 'int' })
  clicks: number;
}
