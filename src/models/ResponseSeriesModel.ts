/**
 * @interface
 * Modelo de objeto principal de retorno da requisição para o endpoint /v1/public/series {@link Series} da Marvel
 */
export default interface ResponseSeriesModel {
  /** ID único da série */
  id?: number;

  /** Título padrão da série */
  title?: string;

  /** Descrição preferencial da série */
  description?: string | null;

  /** URL padrão para identificação da série */
  resourceURI?: string;

  /** Array de URLs públicas relacionadas à série */
  urls?: [
    {
      type?: string;
      url?: string;
    }
  ];

  /** Primeiro ano de publicação da série */
  startYear?: number;

  /** Último ano de publicação da série */
  endYear?: number;

  /**  Classificação de adequação à idade para a série */
  rating?: string;

  /** Tipo da série */
  type?: string;

  /** Data de última modificação da série, no formato string */
  modified?: string;

  /** Objeto que reúne componentes para formação da URL da imagem representativa da série */
  thumbnail?: {
    path?: string;
    extension?: string;
  };

  /**  Uma lista de recursos contendo os criadores associados à série */
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
  /**  Objeto contendo uma lista dos personagens que aparecem nos quadrinhos da série */
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

  /** Objeto contendo uma lista de histórias que aparecem nos quadrinhos da série */
  stories?: {
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

  /** Objeto contendo histórias de quadrinhos da série */
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

  /**  Objeto contendo uma lista de eventos que ocorrem em histórias em quadrinhos desta série */
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

  /** Representação resumida da série que segue esta série */
  next?: string | null;

  /** Representação resumida da série que precedeu esta série */
  previous?: string | null;
}
