import axios from 'axios';
import MarvelAPIParams from '../models/marvelApiParamsInterface';
import MarvelParamsDefinition from '../utils/MarvelParamsDefinition';

export default class MarvelAPIService {
  async getElements(categoryAlias): Promise<unknown[]> {
    try {
      let dataArray: Array<unknown> = [];
      const categoryData: Array<unknown> = [];
      const paramsDefiner = new MarvelParamsDefinition();
      const timeStamp = paramsDefiner.getTimestamp();
      const daysInterval = 7;
      const dateString = paramsDefiner.modifiedsSince(daysInterval);
      const offset = paramsDefiner.offsetter();
      do {
        const response = await axios.get<MarvelAPIParams>(
          `${paramsDefiner.baseURL()}/${categoryAlias}`,
          {
            params: {
              offset: offset.next().value,
              limit: paramsDefiner.maxMarvelAPILimit(),
              ts: timeStamp,
              apikey: paramsDefiner.apikey(),
              modifiedSince: dateString,
              hash: paramsDefiner.hashGenarator(timeStamp)
            }
          }
        );
        dataArray = await response.data.data.results;
        categoryData.push(...dataArray);
      } while (dataArray.length);
      return categoryData;
    } catch (error) {
      console.error(error);
      return Promise.reject('Erro interno do servidor');
    }
  }
}
