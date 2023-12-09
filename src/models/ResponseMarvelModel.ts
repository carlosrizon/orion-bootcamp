import { ResponseCategory } from './ResponseCategoryType';

/**
 * @interface
 * Modelo de objeto de retorno da requisição para os endpoints characters, comics, series, stories e events da Marvel.
 * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 */
export default interface ResponseMarvelModel {
  /** Resultados específicos da requisição relacionados à categoria solicitada */
  data: {
    /** Status code do response da requisição */
    code?: number;

    /** Indicação do status do response da requisição */
    status?: string;

    /** Indicação dos direitos autorais do resultado retornado */
    copyright?: string;

    /** Texto de atribuição de conteúdo para esse resultado à Marvel */
    attributionText?: string;

    /** Representação HTML em formato string do aviso de atribuição do conteúdo para o resultado à Marvel */
    attributionHTML?: string;

    /** Valor de resumo do conteúdo retornado pela requisição */
    etag?: string;

    data: {
      /** Deslocamento solicitado (número de resultados ignorados) da requisição */
      offset?: number;

      /** Limite de resultados solicitado */
      limit?: number;

      /** Número total de personagens disponíveis de acordo com o conjunto de filtros aplicados */
      total?: number;

      /** Número total de resultados retornados pela requisição */
      count?: number;

      /** Array de recursos retornado pela requisição de acordo com a categoria requisitada */
      results: ResponseCategory[];
    };
  };
}
