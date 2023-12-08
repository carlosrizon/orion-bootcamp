import axios from 'axios';
import ResponseMarvelModel from '../models/ResponseMarvelModel';
import MarvelParamsModel from '../models/MarvelParamsModel';
import { ResponseCategory } from '../models/ResponseCategoryType';
import MarvelParamsDefinition from '../utils/MarvelParamsDefinition';
import ParamsWithUrlModel from 'models/ParamsWithUrlModel';

/**
 * Classe que implementa operação de requisição de dados à APIs externas
 */
export default class AxiosService {
  private _classAlias;

  /**
   * Função para get de parâmetros para requisição à API da Marvel
   * @param {string} classAlias
   * @returns
   */
  private _params(classAlias: string): ParamsWithUrlModel {
    const paramsDefiner = new MarvelParamsDefinition(classAlias);
    const params: MarvelParamsModel = paramsDefiner.getParams();
    return { params: params, url: paramsDefiner.getUrl() };
  }

  /**
   * @constructor
   * Cria instância da classe AxiosService
   * @param {string} classAlias - alias string da categoria
   */
  constructor(classAlias: string) {
    this._classAlias = classAlias;
  }

  /**
   * Função de requisição de dados de categorias para a API da Marvel
   * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
   * @async
   * @param {number} offset - deslocamento (número de resultados ignorados) a ser aplicado na requisição
   * @param {string} modifiedSince - string no formato data correspondente à data base de modificação de recursos aplicada na requisição
   * @returns retorna promise de array de objetos do tipo {@link ResponseCategory} a ser resolvida quando do retorno dos dados pela API ou rejeitada caso não haja o retorno esperado
   */
  async getData(
    offset: number,
    modifiedSince?: Date
  ): Promise<ResponseCategory[]> {
    const url = this._params(this._classAlias).url;
    const params = this._params(this._classAlias).params;
    params.offset = offset;
    if (modifiedSince) params.modifiedSince = modifiedSince;

    const response: ResponseMarvelModel = await axios.get(`${url}`, {
      params: params
    });
    return response.data.data.results;
  }

  /**
   * Função que aplica requisição à API da Marvel e retorna número total de recursos da categoria disponíveis na API
   * Categorias: {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}.
   * @async
   * @returns retorna promise de número total de recursos da categoria disponíveis na API da Marvel a ser resolvida quando do retorno do dado ou rejeitada caso não haja o retono esperado
   */
  async getTotal(): Promise<number> {
    const url: string = this._params(this._classAlias).url;
    const response: ResponseMarvelModel = await axios.get(`${url}`, {
      params: this._params(this._classAlias).params
    });
    return response.data.data.total;
  }
}
