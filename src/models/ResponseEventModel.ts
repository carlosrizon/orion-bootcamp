/**
 * @interface
 * Modelo de objeto principal de retorno da requisição para o endpoint /v1/public/events da Marvel
 */
export default interface ResponseEventModel {
  /** ID único do evento */
  id?: number;

  /** Título do evento */
  title?: string;

  /** Descrição do evento */
  description?: string;

  /** URL padrão para identificação do evento */
  resourceURI?: string;

  /** Array de URLs públicas relacionadas ao evento */
  urls?: [
    {
      type?: string;
      url?: string;
    }
  ];

  /** Data de última modificação do evento em formato string */
  modified?: string;

  /** Data de publicação da primeira edição deste evento, em formato string */
  start?: string;

  /** Data de publicação da última edição deste evento, em formato string */
  end?: string;

  /** Objeto que reune componentes para formação da URL da imagem representativa do evento */
  thumbnail?: {
    path?: string;
    extension?: string;
  };

  /**  Objeto contendo uma lista de recursos de criadores cujo trabalho aparece no evento */
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

  /**  Objeto contendo uma lista dos personagens que aparecem no evento */
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

  /** Objeto contendo uma lista de histórias que aparecem nos quadrinhos relacionados ao evento */
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

  /** Objeto contendo histórias de quadrinhos relacionados ao evento */
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

  /** Objeto contendo uma lista de recursos das séries relacionadas ao evento */
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

  /** Objeto contendo representação resumida do evento que se segue a esse evento */
  next?: {
    resourceURI?: string;
    name?: string;
  };

  /** Objeto contendo representação resumida do evento que precedeu este evento */
  previous?: {
    resourceURI?: string;
    name?: string;
  };
}
