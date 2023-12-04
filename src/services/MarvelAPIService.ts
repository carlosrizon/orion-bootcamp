import axios from 'axios';
import MarvelParamsDefiner from '../utils/MarvelParamsDefinition';

export default class MarvelAPIService {
  async getElements(categoryAlias): Promise<unknown[]> {
    try {
      let dataArray: Array<unknown> = [];
      const categoryData: Array<unknown> = [];
      const paramsDefiner = new MarvelParamsDefiner();
      const timeStamp = paramsDefiner.getTimestamp();
      const offset = paramsDefiner.offsetter();
      const daysInterval = 7;
      do {
        const response = await axios.get(
          `${paramsDefiner.baseURL()}/${categoryAlias}`,
          {
            params: {
              offset: offset.next().value,
              limit: paramsDefiner.maxMarvelAPILimit(),
              ts: timeStamp,
              apikey: paramsDefiner.apikey(),
              modifiedSince: paramsDefiner.modifiedsSince(daysInterval),
              hash: paramsDefiner.hashGenerator(timeStamp)
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

  async get1Elements(categoryAlias): Promise<unknown[]> {
    try {
      let dataArray: Array<unknown> = [];
      const categoryData: Array<unknown> = [];
      const paramsDefiner = new MarvelParamsDefiner();
      const timeStamp = paramsDefiner.getTimestamp();
      const offset = paramsDefiner.offsetter();
      const response = await axios.get(
        `${paramsDefiner.baseURL()}/${categoryAlias}`,
        {
          params: {
            offset: offset.next().value,
            limit: 1,
            ts: timeStamp,
            apikey: paramsDefiner.apikey(),
            hash: paramsDefiner.hashGenerator(timeStamp)
          }
        }
      );
      dataArray = await response.data.data.results;
      categoryData.push(...dataArray);
      return categoryData;
    } catch (error) {
      console.error(error);
      return Promise.reject('Erro interno do servidor');
    }
  }
}
