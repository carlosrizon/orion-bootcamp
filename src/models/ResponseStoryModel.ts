/**
 * @interface
 * Modelo de objeto principal de retorno da requisição para o endpoint /v1/public/stories da Marvel
 */
export default interface ResponseStoryModel {
  /** ID único da história */
  id?: number;

  /** Título padrão da história */
  title?: string;

  /** Breve descrição da história */
  description?: string | null;

  /** URL padrão para identificação da história */
  resourceURI?: string;

  /** Tipo da história */
  type?: string;

  /** Data de última modificação da história, em formato string */
  modified?: string;

  /** Objeto que reúne componentes para formação da URL da imagem representativa da história */
  thumbnail?: null | {
    path?: string;
    extension?: string;
  };

  /**  Objeto contendo uma lista de recursos dos criadores associados à história */
  creators?: {
    available?: number;
    collectionURI?: string;
    items?: [
      {
        resourceURI?: string;
        name?: string;
        role?: string;
      }
    ];
    returned?: number;
  };
  /**  Objeto contendo uma lista de recursos de personagens que aparecem na história */
  characters?: {
    available?: number;
    collectionURI?: string;
    items?: [
      {
        resourceURI?: string;
        name?: string;
      }
    ];
    returned?: number;
  };

  /** Objeto contendo uma lista de recursos das séries em que a história aparece */
  series?: {
    available?: number;
    collectionURI?: string;
    items?: [
      {
        resourceURI?: string;
        name?: string;
      }
    ];
    returned?: number;
  };

  /** Objeto contendo uma lista de recursos contendo histórias em quadrinhos nas quais a história se passa */
  comics?: {
    available?: number;
    collectionURI?: string;
    items?: [
      {
        resourceURI?: string;
        name?: string;
      }
    ];
    returned?: number;
  };

  /**  Objeto contendo uma lista de recursos dos eventos em que a história aparece */
  events?: {
    available?: number;
    collectionURI?: string;
    items?: [
      {
        resourceURI?: string;
        name?: string;
        type?: string;
      }
    ];
    returned?: number;
  };

  /** Objeto contendo uma representação resumida da edição em que a história foi originalmente publicada */
  originalIssue?: {
    resourceURI?: string;
    name?: string;
  };
}
