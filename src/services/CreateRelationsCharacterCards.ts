import CategoryModel from 'models/CategoryInterface';
import { categoriesArray } from '../library/categoriesArray';
import MarvelAPIService from './MarvelAPIService';
import { MysqlDataSource } from '../config/database';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import { CharacterComics } from '../entity/CharacterComics';
import Event from '../entity/Event';
import Series from '../entity/Series';
import Story from '../entity/Story';
import { CharacterSeries } from '../entity/CharacterSeries';

export default class CreateRelationsCharacterCards {
  static async createRelations(dataArray) {
    try {
      const charactersRepository = MysqlDataSource.getRepository(Character);
      let character;

      const comicsRepository = MysqlDataSource.getRepository(Comic);
      let comic;
      const seriesRepository = MysqlDataSource.getRepository(Series);
      let series;
      const eventsRepository = MysqlDataSource.getRepository(Event);
      let events;
      const storiesRepository = MysqlDataSource.getRepository(Story);
      let stories;

      const characterComicsRepository =
        MysqlDataSource.getRepository(CharacterComics);
      const characterSeriesRepository =
        MysqlDataSource.getRepository(CharacterComics);
      let characterComic;
      let characterSeries;

      for (const dataObject of dataArray as Array<CategoryModel>) {
        //pegar idMarvel do personagem e encontrar ele
        character = await charactersRepository.findOne({
          where: {
            idMarvel: dataObject.id
          }
        });

        console.log('CHARACTER: ', character);

        //cria comic relations
        for (const item of dataObject.comics.items) {
          const match = item.resourceURI.match(/\d+$/);
          const comicId: number = match ? Number(match[0]) : null;

          //encontrar comic no banco
          comic = await comicsRepository.findOne({
            where: {
              idMarvel: comicId
            }
          });

          console.log('COMIC: ', comic);

          //fazer relacionamento personagem-comic
          if (character && comic) {
            characterComic = new CharacterComics();
            characterComic.character = character;
            characterComic.comic = comic;

            await characterComicsRepository.save(characterComic);
          }
        }

        //cria series relations
        for (const item of dataObject.series.items) {
          const match = item.resourceURI.match(/\d+$/);
          const seriesId: number = match ? Number(match[0]) : null;

          //encontrar series no banco
          series = await seriesRepository.findOne({
            where: {
              idMarvel: seriesId
            }
          });

          console.log('SERIES: ', series);

          //fazer relacionamento personagem-series
          if (character && series) {
            characterSeries = new CharacterSeries();
            characterSeries.character = character;
            characterSeries.series = series;

            await characterSeriesRepository.save(characterSeries);
          }
        }
      }
    } catch (error) {}
  }
}
