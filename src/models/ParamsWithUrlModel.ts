import MarvelParamsModel from './MarvelParamsModel';

/**
 * @interface
 * Modelo de objeto que contém parâmetros para requisição de dados à API da Marvel do tipo {@link MarvelParamsModel} e string url correspondente à concatenação da url base da API e endpoint da requisição
 */
export default interface ParamsWithUrlModel {
  params: MarvelParamsModel;
  url: string;
}
