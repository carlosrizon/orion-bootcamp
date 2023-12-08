import { CategoryClass } from './CategoryClassType';

/**
 * @type
 * Representa tipo de objeto que contém as proriedades class (construtor da classe da categoria) {@link CategoryClass} e respectivo alias string.
 * Categorias: {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 */
export type CategoryClassAndAlias = {
  /** Construtor da classe de categoria */
  class: CategoryClass;

  /** Alias string relativa à categoria */
  alias: string;
};
