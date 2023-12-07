import AxiosService from '../services/AxiosService';
import { ResponseCategory } from '../models/ResponseCategoryType';
import MarvelParamsDefinition from './MarvelParamsDefinition';
import CategoryDataArrayAnsLastOffset from '../models/CategoryDataArrayAnsLastOffset';

/**
 * Classe que implementa operações de manipulação das categorias:
 * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 */
export default class CategoryHandler {
  private _categoryAlias: string;
  private _axios: AxiosService;

  /**
   * @constructor
   * Cria instância da classe CategoryHandler
   * @param {string} categoryAlias - alias string relacionada à classe da categoria
   */
  constructor(categoryAlias: string) {
    this._categoryAlias = categoryAlias;
    this._axios = new AxiosService(this._categoryAlias);
  }

  /**
   * Função que implementa condições necessárias à atualização das categorias por meio da chamada à função {@link getData} do service {@link AxiosService}
   * @param {number} offsetStart - valor inicial do offset a ser aplicado
   * @param {number} batchSize - número de iterações a ser executada no saveCicle
   * @param {null | Date} modifiedSince - Dat base de modificação de recursos de categorias a ser considerada na requisição
   * @returns {Promise<CategoryDataArrayAnsLastOffset>} - retorna promise de objetos to tipo {@link CategoryDataArrayAnsLastOffset}
   */
  async getElements(
    offsetStart: number,
    batchSize: number,
    modifiedSince: null | Date
  ): Promise<CategoryDataArrayAnsLastOffset> {
    const paramsDefiner: MarvelParamsDefinition = new MarvelParamsDefinition(
      this._categoryAlias
    );
    const offsetInstance: Generator<number, void> =
      paramsDefiner.offsetter(offsetStart);
    let offset: number;

    try {
      const dataArray: ResponseCategory[] = [];

      do {
        offset = offsetInstance.next().value as number;
        const response: ResponseCategory[] = modifiedSince
          ? await this._axios.getData(offset, modifiedSince)
          : await this._axios.getData(offset);
        dataArray.push(...response);
        if (!dataArray.length) break;
      } while (--batchSize);

      return { data: dataArray, lastOffset: offset };
    } catch (error) {
      console.error(error);
      return Promise.reject('Erro interno do servidor');
    }
  }
}
