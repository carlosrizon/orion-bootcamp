/**
 * @interface
 * Modelo de objeto de parâmetros utilizados na requisição de dados à API Marvel
 */
export default interface MarvelParamsModel {
  /** timestamp utilizado para composição da hash */
  ts?: number;

  /** string correspondente à criptografia da união de timestamp, chave pública e chave privada da API, considerando algoritmo md5 */
  hash?: string;

  /** chave pública fornecida pela API da Marvel */
  apikey?: string;

  /** limite de resultados a ser aplicado na requisição */
  limit?: number;

  /** Deslocamento (número de resultados ignorados) a ser aplicado na requisição */
  offset?: number;

  /** Database de modificação dos recursos a ser considerada na requisição */
  modifiedSince?: string | Date;
}
