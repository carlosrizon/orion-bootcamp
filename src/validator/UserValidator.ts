import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repository/UserRepository';
import { genderTypes, minimunAgeAllowed } from '../utils/userHelpers';
import moment from 'moment';

export const validationField = [
  body('firstName')
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .bail()
    .matches(/^[^\s]+[\s]{0,1}[a-zA-Z]+$/)
    .withMessage('Nome inválido')
    .bail()
    .toUpperCase(),

  body('lastName')
    .notEmpty()
    .withMessage('Sobrenome não pode ser vazio')
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .bail()
    .toUpperCase(),

  body('gender')
    .notEmpty()
    .withMessage('Gênero não pode ser vazio')
    .bail()
    .isIn(Object.values(genderTypes()))
    .withMessage('Selecione um gênero válido'),

  body('birthDate')
    .notEmpty()
    .withMessage('Data de nascimento não pode ser vazio')
    .bail()
    .isDate({
      format: 'YYYY-MM-DD',
      delimiters: ['-']
    })
    .withMessage('Formato incorreto de data')
    .bail()
    .custom((birthDate: Date) => {
      const today = moment();
      if (today.diff(birthDate, 'years') < minimunAgeAllowed()) {
        return Promise.reject(
          'Idade mínima para acesso à plataforma é de 10 anos'
        );
      }
      return Promise.resolve();
    }),

  body('email')
    .notEmpty()
    .withMessage('E-mail não pode ser vazio')
    .bail()
    .isEmail()
    .withMessage('Informe um e-mail válido')
    .custom(async (email: string) => {
      const repository = new UserRepository();
      const existingUser = await repository.findOneByEmail(email);
      if (existingUser) {
        return Promise.reject('E-mail já cadastrado');
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Informe uma senha')
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

export function Validator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ date: new Date(), status: false, data: errors.array() });
  }
  next();
}
