import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';

export const validateAmountPositiveInteger = [
  query('amount')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('A quantidade deve ser um número positivo inteiro.'),
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
