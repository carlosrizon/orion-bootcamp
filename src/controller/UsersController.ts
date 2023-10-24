import { Home } from '../entity/Home.entity';
import { database } from '../config/database';
import { Request, Response } from 'express';

export class UsersController {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Hello
   *     tags: [Home]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *           description: 'requisição executada com sucesso'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: object
   *                     description: 'objeto json de retorno'
   */
  async create(_req: Request, res: Response) {
    // @See https://typeorm.io/#features
    const homeRepository = database.getRepository(Home);
    const home = new Home();
    home.name = 'Timber';
    // Insere o registro no banco.
    await homeRepository.save(home);
    return res.status(200).send('Hello');
  }

  /**
   * @swagger
   * /:
   *   get:
   *     summary: Hello
   *     tags: [Home]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *           description: 'requisição executada com sucesso'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: object
   *                     description: 'objeto json de retorno'
   */
  async update(_req: Request, res: Response) {
    // @See https://typeorm.io/#features
    const homeRepository = database.getRepository(Home);
    const home = new Home();
    home.name = 'Timber';
    // Insere o registro no banco.
    await homeRepository.save(home);
    return res.status(200).send('Hello');
  }
}
