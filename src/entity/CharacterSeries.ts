import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import Character from './Character';
import Series from './Series';

/**
 * Entidade com informações de relacionamento das entidades {@link Character} e {@link Series}
 */
@Entity('character_series')
export class CharacterSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character)
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Series)
  @JoinColumn({ name: 'series_id' })
  series: Series;
}
