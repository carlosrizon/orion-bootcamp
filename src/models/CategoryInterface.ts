/**
 * @interface
 * Modelo de objeto das categorias Marvel: Character, Series, Comic, Event e Story
 */
export default interface CategoryModel {
  /** Número de ID atribuído pela Marvel */
  idMarvel: number;
  /**
   * Nome original não traduzido.
   *
   * Atributo exclusivo da categoria Character.
   * Not null para essa categoria.
   */
  enName?: string;
  /**
   * Nome traduzido.
   *
   * Atributo exclusivo da categoria Character.
   * Será \'' se não disponível.
   */
  ptName?: string;
  /**
   * Título original não traduzido.
   *
   * Atributo específico das categorias: Series, Comic, Event e Story.
   * Not null para essas categorias.
   */
  enTitle?: string;
  /**
   * Título traduzido.
   *
   * Atributo específico das categorias: Series, Comic, Event e Story.
   * Será \'' se não disponível.
   */
  ptTitle?: string;
  /**
   * Descrição  da categoria, traduzida se possível.
   *
   * Será \'' se não disponível.
   */
  description: string;
  /**
   * Thumbnail  da categoria.
   *
   * Será \'' se não disponível.
   */
  thumb: string;
  /**
   * Link que direciona para o site da marvel com as informações daquele item.
   */
  link: string;
  /**
   * Indicação de tradução de atributos.
   *
   * Será true apenas se todos atributos não nulos forem traduzidos.
   */
  isTranslated: boolean;
}
