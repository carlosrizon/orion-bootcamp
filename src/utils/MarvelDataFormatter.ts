import CategoryModel from '../models/CategoryModel';
import TranslationAPIService from '../services/TranslationAPIService';

/**
 * Classe que implementa manipulação e adequação dos dados retornados pela Marvel ao uso na plataforma
 */
export default class MarvelDataFormatter {
  /**
   * @async
   * Função que implementa formatação das propriedades dos objetos de categorias retornados pela requisição
   * @param objectsArray - Array de objetos de categorias retornados pela requisição à API da Marvel
   * @returns {Promise<CategoryModel[]>} Promise de array de objetos do tipo CategoryModel
   */
  async formatData(objectsArray): Promise<CategoryModel[]> {
    const toBeIgnored = [
      'idMarvel',
      'enName',
      'enTitle',
      'thumb',
      'isTranslated',
      'link'
    ];
    const formattedObjects: CategoryModel[] = await Promise.all(
      objectsArray.map(async (object) => {
        const objectCopy: CategoryModel = this._addProperties(object);
        let isTranslated: boolean = true;

        for (const key in objectCopy) {
          if (
            objectCopy[key] !== '' &&
            objectCopy[key] !== null &&
            !toBeIgnored.includes(key)
          ) {
            const translator = new TranslationAPIService();
            const translatedValue = await translator.getTranslation(
              key,
              objectCopy[key]
            );

            if (!translatedValue) {
              isTranslated = false;
              objectCopy[key] = '';
            } else {
              objectCopy[key] = translatedValue;
            }
          }
        }
        objectCopy.isTranslated = isTranslated;
        return objectCopy;
      })
    );
    return formattedObjects;
  }

  /**
   * @private
   * Função que implementa formatação da thumb das categorias
   * @param {ResponseCategory} object recurso category retornado pela requisição
   * @returns {string} - string correspondente à thumb formatada
   */
  private _thumbFormatter(object): string {
    // stories não possui path
    const path = object.resourceURI.includes('stories')
      ? object.thumbnail
      : object.thumbnail.path;
    return path && !path.includes('not_available')
      ? `${path}.${object.thumbnail.extension}`
      : '';
  }

  /**
   * @private
   * Função que implementa retorno de propriedades de acordo com o tipo da category
   * @param {ResponseCategory} object recurso category retornado pela requisição
   * @returns - objeto com propriedades de acordo com o tipo da category
   */
  private _addProperties(object) {
    const detailLink =
      object.urls?.find((url) => url.type === 'detail')?.url || '';
    const specifcProperties = object.name
      ? { enName: object.name, ptName: object.name }
      : { enTitle: object.title, ptTitle: object.title };
    return {
      ...specifcProperties,
      idMarvel: object.id,
      description: object.description,
      thumb: this._thumbFormatter(object),
      link: detailLink,
      isTranslated: true
    };
  }
}
