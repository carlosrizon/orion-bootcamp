import { Request, Response, NextFunction } from 'express';
import { query, param, validationResult } from 'express-validator';

export const validateGetFavoritesPageParams = [
  query('page')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('O número da página deve ser um número positivo inteiro.'),

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
