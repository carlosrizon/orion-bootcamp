import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

import User from './User';
import Story from './Story';

/**
 * Entidade com informações de cliques por usuário {@link User} por card de história {@link Story}
 */
@Entity('user_story_clicks')
export class UserStoryClicks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Story)
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'int' })
  clicks: number;
}
