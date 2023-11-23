import { Request, Response, NextFunction } from 'express';
import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import moment from 'moment';

/**
 * Classe que implementa operações de verificação e validação para endpoints relacionados à entidade Survey
 */
export default class SurveyValidator {
  /**
   * @param req - Objeto de requisição do Express
   * @param res - Objeto de resposta do Express
   * @param next - Função do Express para chamada do próximo middleware definido na rota
   * @returns Retorna promise de response do Express
   */
  async verifyEligibility(req?: Request, res?: Response, next?: NextFunction) {
    const userId: number = req.params.user_id
      ? Number(req.params.user_id)
      : req.body.userId;

    const userRepository = MysqlDataSource.getRepository(User);

    try {
      // aptidão para pesquisa:
      // usuário cadastrado há pelo menos 15 dias, sem pesquisas registradas
      // usuário cuja última pesquisa registrada tenha pelo menos 15 dias

      const usageStartRangeTime = moment()
        .subtract(15, 'days')
        .endOf('day')
        .toDate();

      const userLastSurveyDates = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.surveys', 'surveys')
        .select('MAX(surveys.createdAt)', 'latestSurvey')
        .addSelect('user.createdAt', 'userCreationDate')
        .where('user.id = :id', { id: userId })
        .getRawOne();

      if (
        userLastSurveyDates.userCreationDate > usageStartRangeTime ||
        userLastSurveyDates.latestSurvey > usageStartRangeTime
      ) {
        return res
          .status(200)
          .json({ date: new Date(), status: true, data: { eligible: false } });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        date: new Date(),
        status: false,
        data: 'erro interno do servidor'
      });
    }
  }
}
