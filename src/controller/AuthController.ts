import { MysqlDataSource } from '../config/database';
import { User } from '../entity/User';
import { Request, Response } from 'express';
import JwtHandler from '../jwtUtils/JwtHandler';
import bcrypt from 'bcrypt';

export class AuthController {
  /**
   * @swagger
   * /login:
   *   post:
   *
   *     summary: Login
   *     tags: [Auth]
   *     requestBody:
   *       description: Envio dos dados de login
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             example:
   *               email: teste@teste.com
   *               password: teste123
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       '201':
   *           description: 'Autenticação bem sucedida.'
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
   *                 data: "<TOKEN_JWT>"
   *       '401':
   *           description: 'Autenticação falhou.'
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
   *                 data: "Senha inválida."
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

  async login(req: Request, res: Response) {
    const userRepository = MysqlDataSource.getRepository(User);

    try {
      //encontra usuario no banco de dados pelo email
      const user = await userRepository
        .createQueryBuilder('user')
        .addSelect(['user.password'])
        .where({
          email: req.body.email
        })
        .getOne();

      if (!user) {
        return res
          .status(401)
          .send({ date: new Date(), status: false, data: 'E-mail inválido.' });
      }

      //conferir flag de ativação
      if (!user.isActivated) {
        return res.status(401).send({
          date: new Date(),
          status: false,
          data: 'Necessária a confirmação do cadastro pelo e-mail.'
        });
      }

      //conferir senha
      const passwordIsValid: boolean = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ date: new Date(), status: false, data: 'Senha inválida.' });
      }

      //atribuir token jwt
      const token = await JwtHandler.signToken(
        { name: user.name, email: user.email },
        {
          algorithm: 'HS256',
          expiresIn: 7200 //2 horas
        }
      );

      return res
        .status(201)
        .send({ date: new Date(), status: true, data: token });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }

  /**
   * @swagger
   * /v1/check:
   *   get:
   *     summary: Verificar cadastro
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: token
   *         schema:
   *           type: string
   *         required: true
   *         description: Token de confirmação de cadastro
   *     responses:
   *       '200':
   *         description: Cadastro confirmado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Mensagem de confirmação
   *       '401':
   *         description: Token inválido ou expirado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 erro:
   *                   type: string
   *                   description: Mensagem de erro
   */
  async confirmRegistration(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string;

    JwtHandler.verifyToken(token, async (err, decodedUser) => {
      if (err) {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
      } else {
        const userEmail = decodedUser.email;
        const userRepository = MysqlDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
          email: userEmail
        });
        user.isActivated = true;
        userRepository.save(user);
        return res
          .status(200)
          .json({ message: 'Cadastro feito com sucesso, efetue o login.' });
      }
    });
  }
}
