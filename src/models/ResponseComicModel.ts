/**
 * @interface
 * Modelo de objeto principal de retorno da requisição para o endpoint /v1/public/comics da Marvel
 */
export default interface ResponseComicModel {
  /** ID único do quadrinho */
  id?: number;

  /** ID da representação digital da história em quadrinhos. Será 0 se a história em quadrinhos não estiver disponível digitalmente */
  digitalId?: number;

  /** Título padrão para a história em quadrinhos */
  title?: string;

  /** Número da edição na série (geralmente será 0 para formatos de coleção) */
  issueNumber?: number;

  /** Se a edição for uma variante (por exemplo, uma capa alternativa, segunda impressão ou corte do diretor), uma descrição textual da variante */
  variantDescription?: string;

  /** Descrição preferencial do quadrinho */
  description?: string;

  /** Data de última modificação do quadrinho em formato string */
  modified?: string;

  /** ISBN da história em quadrinhos (geralmente preenchido apenas para formatos de coleção) */
  isbn?: string;

  /** Número do código de barras UPC do quadrinho (geralmente preenchido apenas para formatos periódicos) */
  upc?: string;

  /** Código Diamond para a história em quadrinhos */
  diamondCode?: string;

  /** Código de barras EAN do quadrinho */
  ean?: string;

  /** Código de barras do ISSN para a história em quadrinhos */
  issn?: string;

  /** Formato de publicação da história em quadrinhos */
  format?: string;

  /** Número de páginas da história em quadrinhos */
  pageCount?: number;

  /** Array contendo às principais informações do quadrinho se publicado no formato texto (impresso) */
  textObjects?: [
    {
      type?: string;
      language?: string;
      text?: string;
    }
  ];

  /** URL padrão para identificação do quadrinho */
  resourceURI?: string;

  /** Array de URLs públicas relacionadas ao quadrinho */
  urls?: [
    {
      type?: string;
      url?: string;
    }
  ];

  /** Objeto contendo representação resumida da série à qual a história em quadrinhos pertence */
  series?: {
    resourceURI?: string;
    name?: string;
  };

  /** Lista de edições variantes da história em quadrinhos */
  variants?: [
    {
      resourceURI?: string;
      name?: string;
    }
  ];

  /**  Lista de coleções que incluem esse quadrinho (geralmente estará vazia se o formato do quadrinho for uma coleção) */
  collections?: [];

  /** Lista de edições coletadas nesta história em quadrinhos (geralmente vazia para formatos periódicos)*/
  collectedIssues?: [];

  /** Lista de datas importantes para essa história em quadrinhos, no formato string */
  dates?: [
    {
      type?: string;
      date?: string;
    }
  ];

  /** Lista de preços para o quadrinho */
  prices?: [
    {
      type?: string;
      price?: number;
    }
  ];

  /** Objeto que reune componentes para formação da URL da imagem representativa do quadrinho */
  thumbnail?: {
    path?: string;
    extension?: string;
  };

  /**  Lista de imagens promocionais associadas à história em quadrinhos */
  images?: [
    {
      path?: string;
      extension?: string;
    }
  ];

  /**  Lista de recursos contendo os criadores associados à história em quadrinhos */
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

  /**  Objeto contendo uma lista dos personagens que aparecem na história em quadrinhos */
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

  /** Objeto contendo uma lista de histórias que aparecem no quadrinho */
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

  /**  Objeto contendo uma lista de eventos em que esse quadrinho aparece. */
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
}
