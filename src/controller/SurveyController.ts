import { Request, Response } from 'express';

/**
 * Classe com operações relacionadas à criação e manipulação de pesquisas de usuários
 */
export default class SurveyController {
  /**
   * @swagger
   *
   * /v1/survey/eligibility/{user_id}:
   *   get:
   *
   *     summary: Requisita informações sobre elegibilidade de usuário para realização de pesquisa de satisfação
   *     description: Retorna parâmetro booleano indicativo da elegibilidade do usuário requisitado para a pesquisa
   *     tags: [Survey]
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1
   *         description: ID do usuário
   *     responses:
   *       '200':
   *         description: Requisição executada com sucesso
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
   *                   description: Status da criação do usuário
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
   *       '500':
   *         description: Erro interno do servidor. Não foi verificar elegibilidade do usuário para pesquisa
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
   *                   description: Status da criação do usuário
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
}
