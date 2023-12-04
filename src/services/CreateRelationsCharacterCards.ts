import CategoryModel from 'models/CategoryInterface';
import { categoriesArray } from '../library/categoriesArray';
import MarvelAPIService from './MarvelAPIService';

export default class CreateRelationsCharacterCards {
  static async createRelations() {
    try {
      const categoryHandler = new MarvelAPIService();
      const dataArray = await categoryHandler.get1Elements('characters');

      //console.log(dataArray);

      for (const dataObject of dataArray as Array<CategoryModel>) {
        //pegar id do personagem e encontrar ele

        for (const comic of dataObject.comics.items) {
          console.log(`Comic item:`, comic);

          const match = comic.resourceURI.match(/\d+$/);
          const comicNumber: number = match ? Number(match[0]) : null;

          console.log('Comic number: ', comicNumber);

          //encontrar comic no banco

          //fazer relacionamento personagem-comic
        }
      }
    } catch (error) {}
  }
}
