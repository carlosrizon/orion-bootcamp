import CategoryModel from '../models/CategoryModel';
import TranslationAPIService from '../services/TranslationAPIService';

export default class MarvelDataFormatter {
  async formatData(objectsArray) {
    const toBeIgnored = [
      'idMarvel',
      'enName',
      'enTitle',
      'thumb',
      'isTranslated'
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

  private _thumbFormatter(object): string {
    // stories não possui path
    const path = object.resourceURI.includes('stories')
      ? object.thumbnail
      : object.thumbnail.path;
    return path && !path.includes('not_available')
      ? `${path}.${object.thumbnail.extension}`
      : '';
  }

  private _addProperties(object) {
    const specifcProperties = object.name
      ? { enName: object.name, ptName: object.name }
      : { enTitle: object.title, ptTitle: object.title };
    return {
      ...specifcProperties,
      idMarvel: object.id,
      description: object.description,
      thumb: this._thumbFormatter(object),
      isTranslated: true
    };
  }
}
