import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Story from '../entity/Story';
import Event from '../entity/Event';
import Character from '../entity/Character';
import RunEnvironmentsModel from '../library/RunEnvironmentsModel';
import { CategoryClassAndAlias } from '../models/CategoryClassAndAliasType';

export default class CategoryUpdateVariables {
  /**
   * @private
   * Array de objetos com instâncias de entidades de categorias e respectivas alias strings {@link CategoryClassAndAlias}
   */
  private _categoriesClassAndAlias: CategoryClassAndAlias[] = [
    { class: Character, alias: 'characters' },
    { class: Comic, alias: 'comics' },
    { class: Series, alias: 'series' },
    { class: Story, alias: 'stories' },
    { class: Event, alias: 'events' }
  ];

  /**
   * @private
   * Objeto do tipo {@link RunEnvironmentsModel}
   */
  private _runEnvironments = {
    DEV: 'development',
    PROD: 'production'
  };

  /**
   * Função de acesso à constante categoriesClassAndAlias
   * @returns {categoriesClassAndAlias} - Array de arrays com instâncias de entidades de categorias e respectivas alias strings
   */
  getCategoriesArray() {
    return this._categoriesClassAndAlias;
  }

  /**
   * Função de acesso ao objeto dos tipos possíveis de ambiente de execução
   * @returns {RunEnvironmentsModel} - retorna objeto do tipo {@link RunEnvironmentsModel}
   */
  getRunEnvironments(): RunEnvironmentsModel {
    return this._runEnvironments;
  }

  /**
   * Método que retorna quantidade total de recursos a ser atualizado por categoria
   * @returns {number} - quantidade total de recursos a ser atualizado por categoria
   */
  devTotalToUpdate = (): number => 70;
}
