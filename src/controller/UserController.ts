import { Request, Response } from 'express';
import { UserRepository } from '../repository/UserRepository';
import User from '../entity/User';
import { EmailSender } from '../library/mail';

/**
 * Classe com operações relacionadas à manipulação e criação de usuários
 */
export class UserController {
  /**
   * @swagger
   * /v1/signup:
   *   post:
   *
   *     summary: Adiciona novo usuário ao banco de dados
   *     tags: [SignUp]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 description: Nome do usuário
   *               lastName:
   *                 type: string
   *                 description: Sobrenome do usuário
   *               gender:
   *                 type: string
   *                 description: Gênero do usuário
   *               birthDate:
   *                 type: string
   *                 description: Data de nascimento do usuário
   *                 format: date
   *               email:
   *                 type: string
   *                 description: Endereço de e-mail do usuário
   *               password:
   *                 type: string
   *                 description: Senha do usuário
   *             example:
   *               firstName: User name
   *               lastName: tester da silva
   *               gender: Prefiro não dizer
   *               birthDate: 1990-12-06
   *               email: email@email.com
   *               password: aAd@12345
   *     responses:
   *       '201':
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
   *                     id:
   *                       type: integer
   *                       description: ID do usuário
   *                     firstName:
   *                       type: string
   *                       description: Nome do usuário
   *                     lastName:
   *                       type: string
   *                       description: Sobrenome do usuário
   *                     gender:
   *                       type: string
   *                       description: Gênero do usuário
   *                     birthDate:
   *                       type: string
   *                       description: Data de nascimento do usuário
   *                     email:
   *                       type: string
   *                       description: Endereço de e-mail do usuário
   *                     createdAt:
   *                       type: string
   *                       description: Data de criação do usuário
   *                     lastUpdate:
   *                       type: string
   *                       description: Data de atualização do usuário
   *                     isActivated:
   *                       type: boolean
   *                       description: Status de ativação do usuário. Valor default falso
   *               example:
   *                 date: 2023-10-28T19:32:46.116Z
   *                 status: true
   *                 data:
   *                   id: 10
   *                   firstName: USER NAME
   *                   lastName: TESTER DA SILVA
   *                   gender: Prefiro não dizer
   *                   birthDate: 2020-02-13
   *                   email: email@email.com
   *                   createdAt: 2023-10-28T19:32:46.000Z
   *                   lastUpdate: 2023-10-28T19:32:46.000Z
   *                   isActivated: false
   *       '400':
   *         description: Um ou mais dados fornecidos na requisição não atendem aos pré-requisitos
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
   *                     type:
   *                       type: string
   *                       description: tipo de do erro
   *                     value:
   *                       type: string
   *                       description: informação passada que não atende aos pré-requisitos
   *                     msg:
   *                       type: string
   *                       description: Mensagem indicativa para tratativa do erro
   *                     path:
   *                       type: string
   *                       description: Indicação específica do local de ocorrência do erro, dado seu tipo.
   *                     location:
   *                       type: string
   *                       description: Indicação do local de ocorrência do erro na requisição
   *               example:
   *                 date: 2023-10-28T16:48:16.792Z
   *                 status: false
   *                 data:
   *                   type: field
   *                   value: Mulhe
   *                   msg: Selecione um gênero válido
   *                   path: gender
   *                   location: body
   *       '500':
   *         description: Erro interno do servidor. Não foi possível processar os dados no banco
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
   *                   type: string
   *                   description: Mensagem de erro
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: false
   *                 data: Erro interno do servidor
   */
  /**
   * Função para criação de usuário no User database com base nos dados fornecidos na requisição.
   * @async
   * @param req - Objeto de requisição do Express
   * @param res - Objeto de resposta do Express
   * @returns {Promise<void>} - Retorna promise a ser resolvida quando da criação do usuário ou rejeitada em caso de erro
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const repository: UserRepository = new UserRepository();

      // Extrai dados do usuário do corpo da requisição.
      const userData = req.body;

      // Cria e salva usuário no banco de dados.
      const user: User = await repository.createAndSave(userData);

      // Buca usuário salvo no banco de dados para envio na resposta da requisição
      const savedUser: User = await repository.findOneByEmail(user.email);

      /**
       * Responde à requisição com status 201, data da resposta, status de criação (true) e dados do usuário cadastrado.
       * Dados retornados não incluem hash da senha.
       */
      res.status(201).json({ date: new Date(), status: true, data: savedUser });

      // Envia e-mail de confirmação de cadastro
      const sendEmail = new EmailSender();
      sendEmail.sendConfirmationEmail(user);
    } catch (error) {
      // Trata erros repondendo com status 500, data da resposta, status de criação (false) e mensagem padrão de erro.
      res.status(500).json({
        date: new Date(),
        status: false,
        data: 'Erro interno do servidor'
      });
    }
  };
}
