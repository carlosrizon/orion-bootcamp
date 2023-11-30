import { Request, Response } from 'express';
import SurveyRepository from '../repository/SurveyRepository';
import Survey from '../entity/Survey';

/**
 * Classe com operações relacionadas à criação e manipulação de pesquisas de usuários
 */
export default class SurveyController {
  /**
   * @swagger
   *
   * /v1/survey/user_eligibility:
   *   get:
   *
   *     summary: requisita informações sobre elegibilidade de usuário para realização de pesquisa de satisfação
   *     description: retorna objeto com parâmetro booleano indicativo da elegibilidade do usuário requisitado para a pesquisa
   *     tags: [Survey]
   *     responses:
   *       '200':
   *         description: requisição executada com sucesso. Usuário elegível à realização da pesquisa.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: status da elegibilidade do usuário
   *                 data:
   *                   type: object
   *                   properties:
   *                     eligible:
   *                       type: boolean
   *                       description: indicação da elegibilidade do usuário para a realização da pesquisa
   *               example:
   *                 date: 2023-10-28T19:32:46.116Z
   *                 status: true
   *                 data:
   *                   eligible: true
   *       '422':
   *         description: servidor compreende a requisição, mas não pode processar dados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da elegibilidade para a pesquisa
   *                 data:
   *                   type: object
   *                   properties:
   *                     date:
   *                       type: date
   *                       description: data de envio da resposta à requisição
   *                     status:
   *                       type: boolean
   *                       description: status da elegibilidade do usuário
   *                     data:
   *                       type: object
   *                       properties:
   *                         eligible:
   *                           type: boolean
   *                           description: indicação da elegibilidade do usuário para a realização da pesquisa
   *               example:
   *                 date: 2023-10-28T19:32:46.116Z
   *                 status: false
   *                 data:
   *                   eligible: false
   *       '500':
   *         description: erro interno do servidor. Não foi verificar elegibilidade do usuário para pesquisa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: status do processamento da requisição
   *                 data:
   *                   type: object
   *                   description: mensagem de erro
   *                   data: Erro interno do servidor
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: false
   *                 data: Erro interno do servidor
   */
  async eligible(req?: Request, res?: Response): Promise<void> {
    res
      .status(200)
      .json({ date: new Date(), status: true, data: { eligible: true } });
  }

  /**
   * @swagger
   *
   * /v1/survey/user_answer:
   *   post:
   *
   *     summary: requisita processamento de dados relacionadas à realização da pesquisa de satisfação do suário
   *     tags: [Survey]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *                 description: comentário de avaliação do usuário quanto à sua experiência na plataforma
   *               grade:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 1
   *                 description: nota do usuário para sua experiência na plataforma
   *             example:
   *               comment: Melhor plataforma do Brasil!
   *               grade: 5
   *     responses:
   *       '201':
   *         description: requisição executada com sucesso. Pesquisa salva no banco de dados.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: status do processamento da requisição
   *                 data:
   *                   type: object
   *                   properties:
   *                     comment:
   *                       type: string
   *                       description: comentário de avaliação do usuário quanto à sua experiência na plataforma
   *                     grade:
   *                       type: integer
   *                       description: nota do usuário para sua experiência na plataforma
   *                     answered:
   *                       type: boolean
   *                       description: indicação de status da pesquisa, se respondida ou não
   *                     user:
   *                       type: string
   *                       description: número do ID do usuário
   *                     id:
   *                       type: integer
   *                       description: número do ID da pesquisa criada
   *                     createdAt:
   *                       type: string
   *                       format: date
   *                       description: data de criação da pesquisa no banco de dados
   *               example:
   *                 date: 2023-10-28T19:32:46.116Z
   *                 status: true
   *                 data:
   *                   comment: Melhor plataforma do Brasil!
   *                   grade: 5
   *                   answered: true
   *                   user: 1
   *                   id: 100
   *                   createdAt: 2023-11-23T15:10:20.341Z
   *       '400':
   *         description: um ou mais dados fornecidos na requisição não atendem aos pré-requisitos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: status da criação da pesquisa
   *                 data:
   *                   type: object
   *                   properties:
   *                     type:
   *                       type: string
   *                       description: tipo de do erro
   *                     value:
   *                       type: string
   *                       description: informação passada que não atende aos pré-requisitos
   *                     msg:
   *                       type: string
   *                       description: mensagem indicativa para tratativa do erro
   *                     path:
   *                       type: string
   *                       description: indicação específica do local de ocorrência do erro, dado seu tipo
   *                     location:
   *                       type: string
   *                       description: indicação do local de ocorrência do erro na requisição
   *               example:
   *                 date: 2023-10-28T16:48:16.792Z
   *                 status: false
   *                 data:
   *                   type: field
   *                   value: plataforma muito besta!
   *                   msg: Comentário contém palavra(s) imprópria(s) ou ofensiva(s)
   *                   path: comment
   *                   location: body
   *       '422':
   *         description: servidor compreende a requisição, mas não pode processar dados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da elegibilidade para a pesquisa
   *                 data:
   *                   type: object
   *                   properties:
   *                     date:
   *                       type: date
   *                       description: data de envio da resposta à requisição
   *                     status:
   *                       type: boolean
   *                       description: status da elegibilidade do usuário
   *                     data:
   *                       type: object
   *                       properties:
   *                         eligible:
   *                           type: boolean
   *                           description: indicação da elegibilidade do usuário para a realização da pesquisa
   *               example:
   *                 date: 2023-10-28T19:32:46.116Z
   *                 status: false
   *                 data:
   *                   eligible: false
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da criação da pesquisa
   *                 data:
   *                   type: string
   *                   description: Mensagem de erro
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: false
   *                 data: Erro interno do servidor
   */
  async create(req?: Request, res?: Response): Promise<void> {
    try {
      const surveyRepository = new SurveyRepository();

      const [user, others] = [req.body.user, { ...req.body }];
      delete others.user;

      const survey: Survey = await surveyRepository.createAndSave({
        ...others,
        user: user.id
      });

      res.status(201).json({ date: new Date(), status: true, data: survey });
    } catch (error) {
      res.status(500).json({
        date: new Date(),
        status: false,
        data: 'erro interno do servidor'
      });
    }
  }
}
