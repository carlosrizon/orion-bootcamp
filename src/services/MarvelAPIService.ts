import axios from 'axios';
import MarvelParamsDefiner from '../utils/MarvelParamsDefinition';

export default class MarvelAPIService {
  async getElementsByBatches(
    categoryAlias,
    currentBatch: number,
    batchSize: number
  ): Promise<unknown[]> {
    try {
      let dataArray: Array<unknown> = [];
      const categoryData: Array<unknown> = [];
      const paramsDefiner = new MarvelParamsDefiner();
      const timeStamp = paramsDefiner.getTimestamp();
      let offset = currentBatch * batchSize;

      for (let i = 0; i < batchSize / 100; i++) {
        const response = await axios.get(
          `${paramsDefiner.baseURL()}/${categoryAlias}`,
          {
            params: {
              offset: offset,
              limit: paramsDefiner.maxMarvelAPILimit(),
              ts: timeStamp,
              apikey: paramsDefiner.apikey(),
              hash: paramsDefiner.hashGenerator(timeStamp)
            }
          }
        );
        dataArray = await response.data.data.results;
        categoryData.push(...dataArray);
        offset += dataArray.length;
        if (dataArray.length == 0) {
          break;
        }
      }
      return categoryData;
    } catch (error) {
      console.error(error);
      return Promise.reject('Erro interno do servidor');
    }
  }
}
