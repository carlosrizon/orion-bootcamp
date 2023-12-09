import { CategoryClass } from '../models/CategoryClassType';
import { MysqlDataSource } from '../config/database';
import CategoryModel from '../models/CategoryModel';
import { DeepPartial, Repository } from 'typeorm';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import Event from '../entity/Event';
import Series from '../entity/Series';
import Story from '../entity/Story';

/**
 * Classe que implementa operações de criação e manipulação de categorias nos respectivos databases. Relacionado às categorias:
 * {@link Character}, {@link Series}, {@link Comic}, {@link Event} e {@link Story}
 */
export default class CategoryRepository {
  private _categoryName: CategoryClass;
  private _categoryAlias: string;

  /**
   * @constructor
   * Cria uma instância da classe CategoryRepository
   * @param {CategoryClass} categoryName - Classe da categoria
   * @param {string} categoryAlias - Alias string associado à classe da categoria
   */
  constructor(categoryName: CategoryClass, categoryAlias: string) {
    this._categoryAlias = categoryAlias;
    this._categoryName = categoryName;
  }

  /**
   * @async
   * Função de criação e atualização de registros de categorias nos respectivos databases
   * @param {CategoryModel[]} objectsArray - array de objetos do tipo CategoryModel
   * @param {Character | Comic | Event | Series | Story} Category - instância de entidade de categoria
   * @returns {Promise<void>} - retorna promise a ser resolvida quando da criação/atualização de registro da categoria ou rejeitada caso não seja possível a criação/atualização
   */
  async updateOrSave(formattedArray: CategoryModel[]): Promise<void> {
    const repository: Repository<Character | Comic | Event | Series | Story> =
      MysqlDataSource.getRepository(this._categoryName);
    // retorna array de objetos com relação de id e respectivo idMarvel
    const idAndIdMarvel: DeepPartial<CategoryModel[]> = await repository
      .createQueryBuilder(`${this._categoryAlias}`)
      .select(`${this._categoryAlias}.id`)
      .addSelect(`${this._categoryAlias}.idMarvel`)
      .where(`${this._categoryAlias}.idMarvel IN (:...idsMarvel)`, {
        idsMarvel:
          formattedArray.length > 0
            ? formattedArray.map((category) => {
                return category.idMarvel;
              })
            : [-1]
      })
      .getRawMany();

    // retorna objeto e id para objetos a serem atualizados já existentes no banco
    const objectsArray: CategoryModel[] = formattedArray.map((object) => {
      const corresponding: DeepPartial<CategoryModel> = idAndIdMarvel.find(
        (obj) => obj[`${this._categoryAlias}_idMarvel`] == object.idMarvel
      );

      const id: null | number = corresponding
        ? corresponding[`${this._categoryAlias}_id`]
        : null;

      if (id) {
        return { id: id, ...object };
      } else {
        return object;
      }
    });

    if (objectsArray.length > 0)
      await repository.upsert(objectsArray, ['idMarvel']);
  }

  /**
   * @async
   * Função que retorna total de registros na tabela da categoria
   * @returns - retorna promise de número total de registros
   */
  async count(): Promise<number> {
    const repository = MysqlDataSource.getRepository(this._categoryName);
    return await repository.count();
  }
}
