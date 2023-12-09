import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

import Character from './Character';
import User from './User';

/**
 * Entidade com informações de cliques por usuário {@link User} por card de personagem {@link Character}
 */
@Entity('user_character_clicks')
export class UserCharacterClicks {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column({ type: 'int' })
  clicks: number;
}
