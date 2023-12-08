import Character from '../entity/Character';
import { MysqlDataSource } from '../config/database';
import { CharacterComics } from '../entity/CharacterComics';
import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Event from '../entity/Event';
import { CharacterSeries } from '../entity/CharacterSeries';
import { CharacterEvents } from '../entity/CharacterEvents';
import Story from '../entity/Story';
import { CharacterStories } from '../entity/CharacterStories';
import { Category } from './cardsMetricsUtils';

interface formattedCard {
  id: number;
  description: string;
  thumb: string;
}

/**
 *
 * @param {Character} character - Personagem sobre o qual se quer obter os quadrinhos relacionados
 * @returns {Promise<Comic[]>} - Retorna um array de objetos JSON, no formato {id, description, thumb}
 */
export async function getComicsByCharacter(
  character: Character
): Promise<Comic[]> {
  const characterComicsRepository =
    MysqlDataSource.getRepository(CharacterComics);

  const characterComics = await characterComicsRepository.find({
    where: { character: { id: character.id } },
    relations: ['comic']
  });

  const comics = characterComics.map((characterComic) => characterComic.comic);

  const formattedComics = selectFewValues(comics);

  return formattedComics;
}

/**
 *
 * @param {Character} character - Personagem sobre o qual se quer obter as series relacionadas
 * @returns {Promise<Series[]>} - Retorna um array de objetos JSON, no formato {id, description, thumb}
 */
export async function getSeriesByCharacter(
  character: Character
): Promise<Series[]> {
  const characterSeriesRepository =
    MysqlDataSource.getRepository(CharacterSeries);

  const characterSeries = await characterSeriesRepository.find({
    where: { character: { id: character.id } },
    relations: ['series']
  });

  const series = characterSeries.map(
    (characterSeries) => characterSeries.series
  );

  const formattedSeries = selectFewValues(series);

  return formattedSeries;
}

/**
 *
 * @param {Character} character - Personagem sobre o qual se quer obter os eventos relacionados
 * @returns {Promise<Event[]>} - Retorna um array de objetos JSON, no formato {id, description, thumb}
 */
export async function getEventsByCharacter(
  character: Character
): Promise<Event[]> {
  const characterEventsRepository =
    MysqlDataSource.getRepository(CharacterEvents);

  const characterEvents = await characterEventsRepository.find({
    where: { character: { id: character.id } },
    relations: ['event']
  });

  const events = characterEvents.map(
    (characterEvents) => characterEvents.event
  );

  const formattedEvents = selectFewValues(events);

  return formattedEvents;
}

/**
 *
 * @param {Character} character - Personagem sobre o qual se quer obter as histórias relacionadas
 * @returns {Promise<Story[]>} - Retorna um array de objetos JSON, no formato {id, description, thumb}
 */
export async function getStoriesByCharacter(
  character: Character
): Promise<Story[]> {
  const characterStoriesRepository =
    MysqlDataSource.getRepository(CharacterStories);

  const characterStories = await characterStoriesRepository.find({
    where: { character: { id: character.id } },
    relations: ['story']
  });

  const stories = characterStories.map(
    (characterStories) => characterStories.story
  );

  const formattedStories = selectFewValues(stories);

  return formattedStories;
}

/**
 *
 * @param {Array<Object>} cards - Um array de cards com todos os seus valores
 * @returns {formattedCard[]} - Um array de cards com os valores {id, description, thumb} somente
 */
function selectFewValues(cards) {
  const formattedCards = cards.map(({ id, description, thumb }) => ({
    id,
    description,
    thumb
  }));

  return formattedCards;
}
