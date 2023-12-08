import { ResponseCategory } from './ResponseCategoryType';

/**
 * @interface
 * Modelo de objeto que contém array de dados de categoria e número correspondente ao offset aplicado na última requisição
 */
export default interface CategoryDataArrayAnsLastOffset {
  /** Array de dados de categoria */
  data: ResponseCategory[];

  /** Número correspondente ao offset aplicado na última requisição */
  lastOffset: number;
}
