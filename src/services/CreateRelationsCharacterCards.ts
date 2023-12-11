import { MysqlDataSource } from '../config/database';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import { CharacterComics } from '../entity/CharacterComics';
import Event from '../entity/Event';
import Series from '../entity/Series';
import Story from '../entity/Story';
import { CharacterSeries } from '../entity/CharacterSeries';
import { CharacterEvents } from '../entity/CharacterEvents';
import { CharacterStories } from '../entity/CharacterStories';
import ResponseCharacterModel from '../models/ResponseCharacterModel';
import ResponseMarvelModel from '../models/ResponseMarvelModel';

/**
 * Classe que implementa relacionamento da categoria Character {@link Character} com demais categorias Marvel:
 * {@link Comic}, {@link Event}, {@link Series} e {@link Story}
 */
export default class CreateRelationsCharacterCards {
  static async createRelations(dataArray) {
    try {
      const charactersRepository = MysqlDataSource.getRepository(Character);
      let character: Character;

      const comicsRepository = MysqlDataSource.getRepository(Comic);
      let comic: Comic;
      const seriesRepository = MysqlDataSource.getRepository(Series);
      let series: Series;
      const eventsRepository = MysqlDataSource.getRepository(Event);
      let event: Event;
      const storiesRepository = MysqlDataSource.getRepository(Story);
      let story: Story;

      const characterComicsRepository =
        MysqlDataSource.getRepository(CharacterComics);
      const characterSeriesRepository =
        MysqlDataSource.getRepository(CharacterSeries);
      const characterEventsRepository =
        MysqlDataSource.getRepository(CharacterEvents);
      const characterStoriesRepository =
        MysqlDataSource.getRepository(CharacterStories);

      let characterComic: CharacterComics;
      let characterSeries: CharacterSeries;
      let characterEvent: CharacterEvents;
      let characterStory: CharacterStories;

      for (const dataObject of dataArray as Array<ResponseCharacterModel>) {
        //pegar idMarvel do personagem e encontrar ele
        character = await charactersRepository.findOne({
          where: {
            idMarvel: dataObject.id
          }
        });

        //relaciona personagem a comics
        for (const item of dataObject.comics.items) {
          const match: RegExpMatchArray = item.resourceURI.match(/\d+$/);

          let comicId: number;
          if (match) {
            comicId = Number(match[0]);
          } else {
            continue;
          }

          //encontrar comic no banco
          comic = await comicsRepository.findOne({
            where: {
              idMarvel: comicId
            }
          });

          //fazer relacionamento personagem-comic
          if (character && comic) {
            const existingRecord = await characterComicsRepository.findOne({
              where: {
                character: { id: character.id },
                comic: { id: comic.id }
              }
            });

            if (!existingRecord) {
              characterComic = new CharacterComics();
              characterComic.character = character;
              characterComic.comic = comic;

              await characterComicsRepository.save(characterComic);
            }
          }
        }

        //relaciona personagem a series
        for (const item of dataObject.series.items) {
          const match: RegExpMatchArray = item.resourceURI.match(/\d+$/);

          let seriesId: number;
          if (match) {
            seriesId = Number(match[0]);
          } else {
            continue;
          }

          //encontrar series no banco
          series = await seriesRepository.findOne({
            where: {
              idMarvel: seriesId
            }
          });

          //fazer relacionamento personagem-series
          if (character && series) {
            const existingRecord: CharacterSeries =
              await characterSeriesRepository.findOne({
                where: {
                  character: { id: character.id },
                  series: { id: series.id }
                }
              });

            if (!existingRecord) {
              characterSeries = new CharacterSeries();
              characterSeries.character = character;
              characterSeries.series = series;

              await characterSeriesRepository.save(characterSeries);
            }
          }
        }

        //relaciona personagem a events
        for (const item of dataObject.events.items) {
          const match: RegExpMatchArray = item.resourceURI.match(/\d+$/);

          let eventId: number;
          if (match) {
            eventId = Number(match[0]);
          } else {
            continue;
          }

          //encontrar event no banco
          event = await eventsRepository.findOne({
            where: {
              idMarvel: eventId
            }
          });

          //fazer relacionamento personagem-event
          if (character && event) {
            const existingRecord = await characterEventsRepository.findOne({
              where: {
                character: { id: character.id },
                event: { id: event.id }
              }
            });

            if (!existingRecord) {
              characterEvent = new CharacterEvents();
              characterEvent.character = character;
              characterEvent.event = event;

              await characterEventsRepository.save(characterEvent);
            }
          }
        }

        //relaciona personagem a stories
        for (const item of dataObject.stories.items) {
          const match: RegExpMatchArray = item.resourceURI.match(/\d+$/);

          let storyId: number;
          if (match) {
            storyId = Number(match[0]);
          } else {
            continue;
          }

          //encontrar story no banco
          story = await storiesRepository.findOne({
            where: {
              idMarvel: storyId
            }
          });

          //fazer relacionamento personagem-story
          if (character && story) {
            const existingRecord = await characterStoriesRepository.findOne({
              where: {
                character: { id: character.id },
                story: { id: story.id }
              }
            });

            if (!existingRecord) {
              characterStory = new CharacterStories();
              characterStory.character = character;
              characterStory.story = story;

              await characterStoriesRepository.save(characterStory);
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
