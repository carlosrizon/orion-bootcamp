import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Story from '../entity/Story';
import Event from '../entity/Event';
import Character from '../entity/Character';

const categoriesClassAndAlias = [
  [Character, 'characters'],
  [Comic, 'comics'],
  [Series, 'series'],
  [Story, 'stories'],
  [Event, 'events']
];

export function categoriesArray() {
  return categoriesClassAndAlias;
}
