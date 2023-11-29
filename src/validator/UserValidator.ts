import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repository/UserRepository';
import UserValidatorParams from '../utils/UserValidatorParams';
import { differenceInYears, parseISO } from 'date-fns';

/**
 * Classe que implementa operações de verificação de dados de usuários a serem cadastrados, enviados na requisição
 */
export default class UserValidator {
  /**
   * Função para verificação dos dados do usuário, se atendem aos pré-requistos definidos
   *
   * @param req - Objeto de requisição do Express
   * @param res - Objeto de resposta do Express
   * @param next - Função do Express para chamada do próximo middleware definido na rota
   * @returns Retorna promise de response do Express
   */
  async verify(req?: Request, res?: Response, next?: NextFunction) {
    const userValidatorParams = new UserValidatorParams();

    const validationChain = [
      body('firstName')
        .notEmpty()
        .withMessage('Nome não fornecido')
        .bail()
        .matches(/^[^\s]+[\s]{0,1}[a-zA-Z]+$/)
        .withMessage('Nome inválido')
        .bail()
        .toUpperCase(),

      body('lastName')
        .notEmpty()
        .withMessage('Sobrenome não fornecido')
        .bail()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Sobrenome inválido')
        .bail()
        .toUpperCase(),

      body('gender')
        .notEmpty()
        .withMessage('Gênero não fornecido')
        .bail()
        .isIn(Object.values(userValidatorParams.genderTypes()))
        .withMessage('Gênero inválido'),

      body('birthDate')
        .notEmpty()
        .withMessage('Data de nascimento não fornecida')
        .bail()
        .isDate({
          format: 'YYYY-MM-DD',
          delimiters: ['-']
        })
        .withMessage('Formato incorreto de data')
        .bail()
        .custom((birthDate: string) => {
          const today = new Date();
          const birthDateToDate = parseISO(birthDate);
          if (
            differenceInYears(today, birthDateToDate) <
            userValidatorParams.minimunAgeAllowed()
          ) {
            return Promise.reject(
              'Idade mínima para acesso à plataforma é de 10 anos'
            );
          }
          return Promise.resolve();
        })
        .custom((birthDate: string) => {
          const today = new Date();
          const birthDateToDate = parseISO(birthDate);
          if (
            differenceInYears(today, birthDateToDate) >
            userValidatorParams.maxConsideredAge()
          ) {
            return Promise.reject('Idade não factível');
          }
          return Promise.resolve();
        }),

      body('email')
        .notEmpty()
        .withMessage('E-mail não fornecidoo')
        .bail()
        .isEmail()
        .withMessage('E-mail inválido')
        .custom(async (email: string) => {
          const repository = new UserRepository();
          const existingUser = await repository.findUserByEmailOrID(
            email,
            'email'
          );
          if (existingUser) {
            return Promise.reject('E-mail já cadastrado');
          }
          return true;
        }),

      body('password')
        .notEmpty()
        .withMessage('Senha não fornecida')
        .bail()
        .isStrongPassword({
          minLength: 8,
          minLowercase: 0,
          minUppercase: 0,
          minNumbers: 1,
          minSymbols: 1
        })
        .withMessage(
          'A senha deve conter no mínimo 8 caracteres, sendo ao menos 1 letra, 1 número e 1 caracter especial'
        )
        .custom((value) => {
          if (!/[a-zA-Z]/.test(value)) {
            return Promise.reject(
              'A senha deve conter no mínimo 8 caracteres, sendo ao menos 1 letra, 1 número e 1 caracter especial'
            );
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