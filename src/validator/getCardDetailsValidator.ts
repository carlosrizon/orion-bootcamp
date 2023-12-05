import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import { Category } from '../utils/cardsMetricsUtils';

export const validateCardDetailsParams = [
  param('category')
    .isIn(Object.values(Category))
    .withMessage(
      'Parâmetro de categoria inválido. Deve ser um dos valores: characters, comics, series, stories, events.'
    ),

  param('category_id')
    .isInt({ gt: 0 })
    .withMessage('O ID da categoria deve ser um número positivo inteiro.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ date: new Date(), status: false, data: errors.array() });
    }

    next();
  }
];
