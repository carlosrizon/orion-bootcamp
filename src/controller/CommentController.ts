import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import { Request, Response } from 'express';
import { Category } from '../utils/cardsMetricsUtils';
import CommentRepository from '../repository/CommentRepository';
import { CommentValidator } from '../validator/commentValidator';
import { Comments } from '../entity/Comments';

export class CommentController {
  /**
   * @swagger
   * /v1/comments/{category}/{categoryId}:
   *   post:
   *     summary: Cria um novo comentário
   *     description: Cria um novo comentário em uma categoria e um item específico.
   *     security:
   *       - BearerAuth: []
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum:
   *             - characters
   *             - comics
   *             - series
   *             - stories
   *             - events
   *         description: Categoria do card
   *       - in: path
   *         name: categoryId
   *         required: true
   *         description: O ID da categoria
   *         schema:
   *           type: integer
   *     requestBody:
   *       description: Dados do comentário
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *                 example: Um comentário bem legal!
   *     responses:
   *       '200':
   *         description: Comentário criado com sucesso
   *         content:
   *           application/json:
   *             example:
   *               date: 2023-12-01T12:34:56.789Z
   *               status: true
   *               data: Comentário criado com sucesso!
   *       '400':
   *         description: Requisição inválida devido a parâmetros ausentes ou inválidos
   *         content:
   *           application/json:
   *             example:
   *               date: 2023-12-01T12:34:56.789Z
   *               status: false
   *               data: Ocorreu um erro ao encontrar o usuário.
   *       '500':
   *         description: Ocorreu um erro interno do servidor
   *         content:
   *           application/json:
   *             example:
   *               date: 2023-12-01T12:34:56.789Z
   *               status: false
   *               data: Ocorreu um erro interno ao criar o comentário, tente novamente.
   */
  async createComment(req: Request, res: Response) {
    try {
      const { category, categoryId } = req.params;
      const user_id = req.body.user.id;
      const comment = req.body.comment;
      const userRepository = MysqlDataSource.getRepository(User);
      const commentRepository = new CommentRepository();

      const user = await userRepository.findOne({ where: { id: user_id } });

      if (!user) {
        return res.status(400).send({
          date: new Date(),
          status: false,
          data: 'Ocorreu um erro ao encontrar o usuário.'
        });
      }

      if (!Object.values(Category).includes(category as Category)) {
        return res.status(400).send({
          date: new Date(),
          status: false,
          data: 'Categoria inválida.'
        });
      }
      const bannedWords = CommentValidator.getBannedWords();

      if (CommentValidator.containsBannedWords(comment, bannedWords)) {
        return res.status(400).send({
          date: new Date(),
          status: false,
          data: 'O comentário contém palavras impróprias.'
        });
      }

      const newComment = await commentRepository.createAndSave({
        user: user,
        category: category,
        categoryId: Number(categoryId),
        comment: comment
      });

      return res.status(200).send({
        date: new Date(),
        status: true,
        data: 'Comentário criado com sucesso!'
      });
    } catch (err) {
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Ocorreu um erro interno do servidor.'
      });
    }
  }

  /**
   * @swagger
   *
   * /v1/comments/{category}/{categoryId}:
   *   get:
   *
   *     summary: Requisita página de comentários
   *     description: Retorna uma quantidade de 3 comentários, por página, ordenados por data
   *     security:
   *       - BearerAuth: []
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum:
   *             - characters
   *             - comics
   *             - series
   *             - stories
   *             - events
   *         description: Categoria do card
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: o ID do card
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Página desejada de comentários
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
   *       '404':
   *           description: 'Requisição falhou.'
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
   *                 data: "Página não encontrada."
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
  async getComments(req: Request, res: Response) {
    try {
      const category = req.params.category as Category;
      const categoryId: number = Number(req.params.categoryId);
      const userId = req.body.user.id;

      const commentPage: number = Number(req.query.page) || 1;

      const offset = (commentPage - 1) * 3;
      const limit = 3;

      //pega repositorio de comentários
      const commentsRepository = MysqlDataSource.getRepository(Comments);

      //find nos 3 comentários mais recentes do card em questão
      const comments = await commentsRepository
        .createQueryBuilder('comments')
        .leftJoinAndSelect('comments.user', 'user')
        .where(
          'comments.category = :category AND comments.categoryId = :categoryId',
          { category, categoryId }
        )
        .orderBy('comments.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      if (comments.length === 0) {
        return res.status(404).send({
          date: new Date(),
          status: false,
          data: 'Página não encontrada.'
        });
      }

      //query que conta quantos comentários o recurso possui
      const totalComments = await commentsRepository
        .createQueryBuilder('comments')
        .where(
          'comments.category = :category AND comments.categoryId = :categoryId',
          { category, categoryId }
        )
        .getCount();

      const commentsInfo = { totalComments: totalComments };

      //adicionar parametro userComment nos objetos comments
      const commentsWithUserComment = comments.map((comment) => ({
        id: comment.id,
        userName: comment.user.firstName,
        userLastName: comment.user.lastName,
        comment: comment.comment,
        createdAt: comment.createdAt,
        categoryId: comment.categoryId,
        category: comment.category,
        userComment: comment.user.id === userId
      }));

      return res.status(200).json({
        date: new Date(),
        status: true,
        data: commentsInfo,
        commentsWithUserComment
      });
    } catch (error) {
      console.log('Erro em getcomments: ', error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.',
        error
      });
    }
  }

  /**
   * @swagger
   *
   * /v1/comments/{commentId}:
   *   delete:
   *
   *     summary: Deleta um comentário especificado
   *     description: Deleta o comentário especificado se ele pertencer ao usuário corrente
   *     security:
   *       - BearerAuth: []
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: commentId
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: o ID do comentário
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
   *                 data: 'Comentário deletado com sucesso.'
   *       '400':
   *           description: 'Requisição malfeita.'
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
   *                 data: "ID de comentário inválido."
   *       '403':
   *           description: 'Operação não permitida.'
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
   *                 data: "O comentário pertence a outro usuário e não pode ser removido."
   *       '404':
   *           description: 'Requisição falhou.'
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
   *                 data: "Comentário não encontrado."
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
  async deleteComment(req: Request, res: Response) {
    try {
      const commentId: number = Number(req.params.comment_id);
      const user: User = req.body.user;

      //valida o parâmetro commentId recebido
      if (isNaN(commentId) || commentId <= 0) {
        return res.status(400).json({
          date: new Date(),
          status: false,
          data: 'ID de comentário inválido.'
        });
      }

      const commentsRepository = MysqlDataSource.getRepository(Comments);

      // encontra o comentário pelo id especificado
      const comment = await commentsRepository
        .createQueryBuilder('comments')
        .leftJoinAndSelect('comments.user', 'user')
        .where({
          id: commentId
        })
        .getOne();

      //verifica se o comentário foi encontrado
      if (!comment) {
        return res.status(404).json({
          date: new Date(),
          status: false,
          data: 'Comentário não encontrado.'
        });
      }

      //verifica se o comentário é do usuario atual
      if (comment.user.id !== user.id) {
        return res.status(403).json({
          date: new Date(),
          status: false,
          data: 'O comentário pertence a outro usuário e não pode ser removido.'
        });
      }

      // deleta comentário
      await commentsRepository.remove(comment);

      return res.status(200).json({
        date: new Date(),
        status: true,
        data: 'Comentário deletado com sucesso.'
      });
    } catch (error) {
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }
}
