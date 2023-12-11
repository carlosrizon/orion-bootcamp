import { DeepPartial, Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { Comments } from '../entity/Comments';

/**
 * Classe com operações relacionadas a entidade de comentários.
 */
export default class CommentRepository {
  private repository: Repository<Comments> =
    MysqlDataSource.getRepository(Comments);
  /**
   *
   * @param {Comments} comment - Parametro utilizado para inserir dados nas colunas da entidade Comments.
   * @returns Salva o comentário associado a uma categoria e a um usuário.
   */
  async createAndSave(comment: DeepPartial<Comments>): Promise<Comments> {
    const newComment: Comments = this.repository.manager.create(Comments, {
      user: comment.user,
      category: comment.category,
      categoryId: comment.categoryId,
      comment: comment.comment
    });

    return await this.repository.save(newComment);
  }
}
