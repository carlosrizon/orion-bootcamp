import CategoryModel from 'models/CategoryInterface';
import { categoriesArray } from '../library/categoriesArray';
import MarvelAPIService from './MarvelAPIService';
import { MysqlDataSource } from '../config/database';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import { CharacterComics } from '../entity/CharacterComics';

export default class CreateRelationsCharacterCards {
  static async createRelations() {
    try {
      const categoryHandler = new MarvelAPIService();
      const dataArray = await categoryHandler.get1Elements('characters');

      const charactersRepository = MysqlDataSource.getRepository(Character);
      let character;

      const comicsRepository = MysqlDataSource.getRepository(Comic);
      let comic;

      const characterComicsRepository = MysqlDataSource.getRepository(CharacterComics)
      let characterComic;

      for (const dataObject of dataArray as Array<CategoryModel>) {
        console.log(dataObject);

        //pegar idMarvel do personagem e encontrar ele
        character = await charactersRepository.findOne({
          where: {
            idMarvel: dataObject.id 
          }
        });

        console.log('CHARACTER: ', character);

        for (const item of dataObject.comics.items) {
          const match = item.resourceURI.match(/\d+$/);
          const comicId: number = match ? Number(match[0]) : null;

          console.log('Comic number: ', comicId);

          //encontrar comic no banco
          comic = await comicsRepository.findOne({
            where: {
              id: comicId
            }
          });

          console.log('COMIC: ', comic);

          //fazer relacionamento personagem-comic
          if(character && comic){
            characterComic = new CharacterComics();
            characterComic.character = character;
            characterComic.comic = comic;

            await characterComicsRepository.save(characterComic);
          }
        }
      }
    } catch (error) {}
  }
}
