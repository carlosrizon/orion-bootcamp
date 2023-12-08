import ResponseCharacterModel from './ResponseCharacterModel';
import ResponseComicModel from './ResponseComicModel';
import ResponseSeriesModel from './ResponseSeriesModel';
import ResponseStoryModel from './ResponseStoryModel';
import ResponseEventModel from './ResponseEventModel';

/**
 * @type
 * Representa tipagem genérica dos responses das requisições de dados de categorias para a API da, que pode ser:
 * {@link ResponseCharacterModel}, {@link ResponseComicModel}, {@link ResponseSeriesModel}, {@link ResponseStoryModel}, {@link ResponseEventModel}
 */
export type ResponseCategory =
  | ResponseCharacterModel
  | ResponseComicModel
  | ResponseSeriesModel
  | ResponseStoryModel
  | ResponseEventModel;
