import { MysqlDataSource } from '../config/database';
import Survey from '../entity/Survey';

/**
 * Classe que implementa operações de criação e manipulação de pesquisas de usuários no database Survey
 */
export default class SurveyRepository {
  private _repository = MysqlDataSource.getRepository(Survey);

  /**
   * Função de criação de novos registros de pesquisa de usuário no database Survey
   * @async
   * @param survey - Objeto do tipo Survey que expande interface SurveyModel com adição da instância do usuário relacionado
   * @returns {Promise<void>} - Retorna promise a ser resolvida quando da criação do registro da pesquisa no database
   */
  async createAndSave(survey): Promise<Survey> {
    const newSurvey: Survey = this._repository.manager.create(Survey, {
      comment: survey.comment,
      grade: survey.grade,
      user: survey.user,
      answered: true
    });

    return await this._repository.save(newSurvey);
  }
}
