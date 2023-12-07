import { DeepPartial, Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import CategoryUpdate from '../entity/CategoryUpdate';

/**
 * Classe que implementa operações de criação de registros de atualização das categorias:
 * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 */
export default class CategoryUpdateRepository {
  private _categoryUpdateRepository: Repository<CategoryUpdate> =
    MysqlDataSource.getRepository(CategoryUpdate);

  /**
   *
   * Função de criação de registros de atualização de categorias no database CategoryUpdate
   * @async
   * @param {DeepPartial<CategoryUpdate>} categoryUpdate - objeto contendo as propriedades de atualização da categoria
   * @returns - retorna promise CategoryUpdate a ser resolvida quando da criação da atualização da categoria ou rejeitada caso não seja possível a criação
   */
  async save(
    categoryUpdate: DeepPartial<CategoryUpdate>
  ): Promise<CategoryUpdate> {
    return await this._categoryUpdateRepository.save(categoryUpdate);
  }

  /**
   * Função que implementa consulta no database CategoryUpdate e retorna data de última modificação da categoria
   * @async
   * @param {string} categoryAlias - alias string correspondente à categoria
   * @returns - data de última atualização da categoria
   */
  async getLatestUpdateByCategory(categoryAlias: string): Promise<Date> {
    const lastUpdateInfo = await this._categoryUpdateRepository
      .createQueryBuilder('categories_updates')
      .select('MAX(categories_updates.updateDate)', 'updateDate')
      .where('categories_updates.categoryAlias = :category', {
        category: categoryAlias
      })
      .getRawOne();
    return lastUpdateInfo.updateDate;
  }
}
