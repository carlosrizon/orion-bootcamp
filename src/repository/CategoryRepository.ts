import { MysqlDataSource } from '../config/database';
import CategoryModel from 'models/CategoryInterface';

/**
 * Classe que implementa operações de criação e manipulação de categorias nos respectivos databases
 * (Character | Comic | Event | Series | Story).
 */
export default class CategoryRepository {
  /**
   * Função de criação e atualização de registros de categorias nos respectivos databases
   * @async
   * @param {CategoryModel[]} objectsArray - Array de objetos do tipo CategoryModel
   * @param {Character | Comic | Event | Series | Story} Category - Instância de entidade de categoria
   * @returns {Promise<void>} - Retorna promise a ser resolvida quando da criação/atualização de registro da categoria
   */
  async updateOrSave(objectsArray: CategoryModel[], Category): Promise<void> {
    const repository = MysqlDataSource.getRepository(Category);
    /**
     * Insere no database da entidade de categoria os valores definidos nos objetos contidos no array.
     * Caso já exista registro de categoria de mesmo valor 'idMarvel', os dados do registro serão atualizados
     * conforme dados de entrada.
     */
    await repository.upsert(objectsArray, ['idMarvel']);
  }
}
