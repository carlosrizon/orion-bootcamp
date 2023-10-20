import express from 'express';
import { check, validationResult } from 'express-validator';

export class HomeValidator {
  validateField = [
    check('name').notEmpty().withMessage('O campo name não pode estar vazio')
  ];

  post = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se a validação passar, você pode chamar a próxima função no middleware
    next();
  };
}
