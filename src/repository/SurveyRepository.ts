import { DeepPartial, Repository } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import Survey from '../entity/Survey';
import User from '../entity/User';
import UserAndLastSurveyDates from '../models/userAndLastSurveyDates';

/**
 * Classe que implementa operações de criação e manipulação de pesquisas de usuários no database Survey
 */
export default class SurveyRepository {
  private _repository = MysqlDataSource.getRepository(Survey);

  /**
   * Função de criação de novos registros de pesquisa de usuário no database Survey
   * @async
   * @param {DeepPartial<Survey>} survey - Objeto do tipo Survey que expande interface SurveyModel com adição da instância do usuário relacionado
   * @returns {Promise<void>} - Retorna promise a ser resolvida quando da criação do registro da pesquisa no database
   */
  async createAndSave(survey: DeepPartial<Survey>): Promise<Survey> {
    const newSurvey: Survey = this._repository.manager.create(Survey, {
      comment: survey.comment,
      grade: survey.grade,
      user: survey.user,
      answered: true
    });

    return await this._repository.save(newSurvey);
  }

  /**
   * Função que dado um determinado usuário, verifica data de última pesquisa associada a esse e, existindo, retorna objeto contendo ambas as informações
   * @param {number} id - Número de ID do usuário
   * @returns {Primise<UserAndLastSurveyDates>} - Promise de retorno de objeto do tipo {@link UserAndLastSurveyDates} quando da sua resolução
   */
  async getUserSurveyDatesByID(id: number): Promise<UserAndLastSurveyDates> {
    const userRepository: Repository<User> =
      MysqlDataSource.getRepository(User);
    const userLastSurveyDates: UserAndLastSurveyDates = await userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.surveys', 'surveys')
      .select('MAX(surveys.createdAt)', 'latestSurvey')
      .addSelect('users.createdAt', 'userCreationDate')
      .where('users.id = :id', { id: id })
      .getRawOne();
    return userLastSurveyDates;
  }
}
