import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { endOfDay, subDays } from 'date-fns';
import * as fs from 'fs';
import SurveyRepository from '../repository/SurveyRepository';

/**
 * Classe que implementa operações de verificação de dados relacionados à pesquisa, enviados na requisição
 */
export default class SurveyValidator {
  /**
   * Função de verificação dos dados da pesquisa, se atendem aos pré-requisitos definidos
   *
   * @param req - Objeto de requisição do Express
   * @param res - Objeto de resposta do Express
   * @param next - Função do Express para chamada do próximo middleware definido na rota
   * @returns Retorna promise de response do Express
   */
  async verify(req?: Request, res?: Response, next?: NextFunction) {
    const surveyRepository = new SurveyRepository();
    const userId: number = req.body.user.id;

    const userLastSurveyDates =
      await surveyRepository.getUserSurveyDatesByID(userId);
    const usageStartRangeTime: Date = endOfDay(subDays(new Date(), 15));

    if (
      userLastSurveyDates.userCreationDate > usageStartRangeTime ||
      userLastSurveyDates.latestSurvey > usageStartRangeTime
    ) {
      return res
        .status(422)
        .json({ date: new Date(), status: false, data: { eligible: false } });
    }

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

      // Validação do comentário, se é string, se tamanho entre mínimo e máximo definidos e se contém palavras ofensivas
      body('comment')
        .isString()
        .withMessage('Tipo de dado inválido para comentário')
        .bail()
        .isLength({
          min: 0,
          max: 300
        })
        .withMessage('Comentário muito extenso!')
        .bail()
        .toLowerCase()
        .custom((userComment: string) => {
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
