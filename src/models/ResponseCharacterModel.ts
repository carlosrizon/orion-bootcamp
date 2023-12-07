/**
 * @interface
 * Modelo de objeto principal de retorno da requisição para o endpoint /v1/public/characters da Marvel
 */
export default interface ResponseCharacterModel {
  /** ID único do personagem */
  id?: number;

  /** Nome do personagem */
  name?: string;

  /** Breve biografia ou descrição do personagem */
  description?: string;

  /** Data de última modificação do personagem, em formato string*/
  modified?: string;

  /** URL padrão para identificação do personagem */
  resourceURI?: string;

  /** Array de URLs públicas relacionadas ao personagem */
  urls?: [
    {
      type?: string;
      url?: string;
    }
  ];

  /** Objeto que reune componentes para formação da URL da imagem representativa do personagem */
  thumbnail?: {
    path?: string;
    extension?: string;
  };

  /** Objeto com lista de quadrinhos onde o personagem aparece */
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

  /** Objeto com lista de histórias onde o personagem aparece */
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

  /** Objeto com lista de eventos onde o personagem aparece  */
  events?: {
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

  /** Objeto com lista de séries onde o personagem aparece */
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
}
