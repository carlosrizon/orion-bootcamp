import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Story from '../entity/Story';
import Event from '../entity/Event';
import Character from '../entity/Character';

// Array de arrays com instâncias de entidades de categorias e respectivas alias strings
const categoriesClassAndAlias = [
  [Comic, 'comics'],
  [Series, 'series'],
  [Story, 'stories'],
  [Event, 'events'],
  [Character, 'characters']
];
//const categoriesClassAndAlias = [[Character, 'characters']];

/**
 * Função de acesso à constante categoriesClassAndAlias
 * @returns {categoriesClassAndAlias} - Array de arrays com instâncias de entidades de categorias e respectivas alias strings
 */
export function categoriesArray() {
  return categoriesClassAndAlias;
}
