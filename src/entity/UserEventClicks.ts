import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

import Event from './Event';
import User from './User';

/**
 * Entidade com informações de cliques por usuário {@link User} por card de evento {@link Event}
 */
@Entity('user_event_clicks')
export class UserEventClicks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'int' })
  clicks: number;
}
