import { MysqlDataSource } from '../config/database';
import Artist from '../entity/Artist';
import { Request, Response } from 'express';

export class ArtistsController {
  /**
   * @swagger
   *
   * /v1/posters:
   *   get:
   *
   *     summary: Requisita posters aleatórios de artistas parceiros
   *     description: Retorna uma quantidade especificada de posters aleatórios
   *     security:
   *       - BearerAuth: []
   *     tags: [Artists]
   *     parameters:
   *       - in: query
   *         name: amount
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Quantidade de posters requisitados
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: true
   *                 data: <ARRAY DE OBJETOS JSON>
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Um erro interno ocorreu."
   *
   */
  async getShowcasePosters(req: Request, res: Response) {
    try {
      const postersAmount: number = Number(req.query.amount) || 4;

      const artistRepository = MysqlDataSource.getRepository(Artist);

      //seleciona posters aleatorios
      const artists = await artistRepository
        .createQueryBuilder('artist')
        .select(['artist.fullName', 'artist.artSampleURL'])
        .orderBy('RAND()')
        .take(postersAmount)
        .getMany();

      res.json({ date: new Date(), status: true, data: artists });
    } catch (error) {
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }
}
