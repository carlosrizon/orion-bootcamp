import CategoryModel from '../models/CategoryInterface';
import TranslationAPIService from '../services/TranslationAPIService';

export default class DataFormatter {
  async formatData(objectsArray) {
    const formattedObjects: CategoryModel[] = await Promise.all(
      objectsArray.map(async (object) => {
        const objectCopy: CategoryModel = this._addProperties(object);
        let isTranslated: boolean = true;

        for (const key in objectCopy) {
          if (objectCopy[key] === null || this._toBeIgnored().includes(key))
            continue;

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

        objectCopy.isTranslated = isTranslated;
        return objectCopy;
      })
    );
    return formattedObjects;
  }

  private _toBeIgnored(): string[] {
    return ['idMarvel', 'enName', 'enTitle', 'thumb', 'isTranslated'];
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

  // criterios de filtro a serem definidos
  private _filterValidElements(formattedObjectsArray): Array<CategoryModel> {
    const filteredArray = formattedObjectsArray.filter((object) => {
      return (
        (object.enTitle || object.enName) && object.description && object.thumb
      );
    });
    return filteredArray;
  }
}
