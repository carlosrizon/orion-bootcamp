import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

import Character from './Character';
import User from './User';

/**
 * Entidade que relaciona usuários aos seus personagens marcados como favoritos
 */
@Entity('user_favorites')
export class UserFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  character: Character;
}
