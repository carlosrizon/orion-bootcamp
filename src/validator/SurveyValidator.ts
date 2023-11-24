import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import moment from 'moment';
import * as fs from 'fs';

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

    // verificação de ID
    if (isNaN(userId) || userId < 0) {
      return res.status(400).json({
        date: new Date(),
        status: false,
        data: 'Número de ID inválido'
      });
    }

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
        return res.status(422).json({
          date: new Date(),
          status: false,
          data: { eligible: false }
        });
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

  /**
   * Função de validação de dados relacionados à pesquisa, enviados na requisição
   *
   * @param req - Objeto de requisição do Express
   * @param res - Objeto de resposta do Express
   * @param next - Função do Express para chamada do próximo middleware definido na rota
   * @returns Retorna promise de response do Express
   */
  async verifyAnswer(req?: Request, res?: Response, next?: NextFunction) {
    const validationChain = [
      // Validação da nota, se foi fornecida, se é inteiro e se está dentro do range válido
      body('grade')
        .notEmpty()
        .withMessage('Nota não fornecida')
        .bail()
        .isInt()
        .withMessage('Nota inválida')
        .bail()
        .custom((grade: number) => {
          const strGrade = String(grade);
          const validGrades = /^[12345]$/;
          if (!strGrade.match(validGrades)) {
            return Promise.reject('Nota inválida');
          }
          return Promise.resolve();
        }),

      // Validação do comentário, se é string e se contém palavras ofensivas
      body('comment')
        .isString()
        .withMessage('Tipo de dado inválido para comentário')
        .bail()
        .toLowerCase()
        .custom(async (userComment: string) => {
          const userCommentWords = userComment.split(/[\s,.!:?;'"]+/);

          const bannedWordsFile = '/app/src/validator/bannedWords.txt';
          const bannedWords: string = fs.readFileSync(bannedWordsFile, 'utf-8');
          const bannedWordsArray = bannedWords.split('\n');

          for (const word of userCommentWords) {
            if (bannedWordsArray.includes(word)) {
              return Promise.reject(
                'Comentário contém palavra(s) imprópria(s) ou ofensiva(s)'
              );
            }
          }
          return Promise.resolve();
        })
    ];

    await Promise.all(validationChain.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ date: new Date(), status: false, data: errors.array() });
    }
    next();
  }
}
