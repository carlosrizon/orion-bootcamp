import MarvelParamsModel from '../models/MarvelParamsModel';
import md5 from 'md5';
import 'dotenv/config';

/**
 * Classe auxiliar que fornece valores constantes a serem utilizados como parâmetros para requisição de dados à API da Marvel
 */
export default class MarvelParamsDefinition {
  private urlComplement: string;
  private hash: string;
  private apikey: string;
  private ts: number;
  private limit: number;

  /**
   * @constructor
   * Cria instância da classe MarvelParamsDefinition
   * @param {string} urlComplement - alias string da categoria utilizada como complmento da url para requisição à API Marvel
   */
  constructor(urlComplement: string) {
    this.urlComplement = urlComplement;
    this.ts = this._getTimestamp();
    this.hash = this._hashGenerator(this.ts);
    this.apikey = this._apikey();
    this.limit = this.maxMarvelAPILimit();
  }

  /**
   * @private
   * Método que retorna valor numérico correspondente ao número de milissegundos desde 1º de janeiro de 1970, representando timestamp de data e hora atuais
   * @returns {number}  - valor numérico que representa data e hora atuais em milissegundos
   */
  private _getTimestamp(): number {
    return Date.now();
  }

  /**
   * @private
   * Método que retorna chave pública de cadastro na API a ser utilizada na requisição
   * @returns {string} - chave pública Marvel
   */
  private _apikey(): string {
    return process.env.MARVEL_API_KEY;
  }

  /**
   * @private
   * Método gerador de hash de autorização a ser utilizada para realização das requisições à API da Marvel
   * @param {number} timestamp - valor numérico que representa data e hora atuais em milissegundos. Valor único para composição da hash
   * @returns {string} - string correspondente à criptografia da união de timestamp, chave pública e chave privada da API, considerando algoritmo md5
   */
  private _hashGenerator(timestamp: number): string {
    return md5(
      timestamp + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_API_KEY
    );
  }

  /**
   * Método get de valores de parâmetros a serem utilizados para requisição à API da Marvel
   * @returns {MarvelParamsModel} - retorna objeto do tipo {@link MarvelParamsModel}
   */
  getParams(): MarvelParamsModel {
    return {
      ts: this.ts,
      hash: this.hash,
      apikey: this.apikey,
      limit: this.limit
    };
  }

  /**
   * Método que concatena urlBase e endpoint da requisição
   * @returns {string} - string correspondente à concatenação da urlBase e endpoint da requisição
   */
  getUrl(): string {
    const baseURL = process.env.MARVEL_URL_BASE;
    return `${baseURL}/${this.urlComplement}`;
  }

  /**
   * Função geradora que retorna valores a serem utilizados como offset na requisição a partir de valor de offset inicial fornecido.
   * Caso não seja fornecido valor inicial para o offset, adota-se zero (0).
   * @param {number} offsetStart - número correspondete ao offset inicial à ser aplicado na requisição
   */
  *offsetter(offsetStart: number = 0): Generator<number, void> {
    let value = offsetStart;
    while (true) {
      yield value;
      value += this.maxMarvelAPILimit();
    }
  }

  /**
   * Método que retorna valor máximo de dados a serem retornados pela API Marvel a cada requisição.
   * Valor definido como sendo o máximo permitido pela própria API
   * @returns {number} - número máximo de dados retornados por requisição
   */
  maxMarvelAPILimit(): number {
    return 100;
  }
}
