import { MysqlDataSource } from '../config/database';
import CategoryModel from 'models/CategoryInterface';

export default class CategoryRepository {
  async updateOrSave(objectsArray: CategoryModel[], Category): Promise<void> {
    const repository = MysqlDataSource.getRepository(Category);
    await repository.upsert(objectsArray, ['idMarvel']);
  }
}
