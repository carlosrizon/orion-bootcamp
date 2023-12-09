import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import Character from './Character';
import Event from './Event';

/**
 * Entidade com informações de relacionamento das entidades {@link Character} e {@link Event}
 */
@Entity('character_events')
export class CharacterEvents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
