import Character from '../entity/Character';
import Comic from '../entity/Comic';
import Event from '../entity/Event';
import Series from '../entity/Series';
import Story from '../entity/Story';

/**
 * @type
 * Representa tipagem genérica das classes de categorias, que pode ser dos tipos:
 * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 *
 */
export type CategoryClass =
  | typeof Character
  | typeof Comic
  | typeof Event
  | typeof Series
  | typeof Story;
