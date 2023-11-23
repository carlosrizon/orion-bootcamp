/* eslint-disable @typescript-eslint/no-unused-vars */
import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import { Request, Response } from 'express';
import JwtHandler from '../services/JwtService';
import bcrypt from 'bcrypt';
import { EmailSender } from '../library/mail';
import { validatePassword } from '../utils/passwordValidate';
import { Token } from '../entity/Token';

export class RecoveryController {
  /**
   * @swagger
   * /v1/recovery:
   *   post:
   *     summary: Validação do email do usuário para recuperação de senha.
   *     description: Valida o email do usuário para recuperação de senha e envia um email se o usuário for encontrado e ativo.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email do usuário para recuperação de senha.
   *                 example: teste@teste.com
   *     responses:
   *       200:
   *         description: Email enviado com sucesso
   *       401:
   *         description: Email inválido ou inexistente
   *       500:
   *         description: Ocorreu um erro interno durante o processamento da solicitação. Tente novamente mais tarde
   */
  async validateUserEmail(req: Request, res: Response) {
    try {
      const userEmail = req.body.email;
      const userRepository = MysqlDataSource.getRepository(User);
      const findUser = await userRepository.findOneBy({
        email: userEmail
      });
      if (!findUser) {
        return res.status(401).send({
          date: new Date(),
          status: false,
          data: 'Email inválido ou inexistente.'
        });
      }
      if (!findUser.isActivated) {
        return res.status(401).send({
          date: new Date(),
          status: false,
          data: 'Necessária a confirmação do cadastro pelo e-mail.'
        });
      }
      const sendMail = new EmailSender();
      sendMail.sendPasswordRecoveryEmail(findUser);
      return res.status(200).send({
        date: new Date(),
        status: true,
        data: 'Email de recuperação de senha enviado com sucesso!'
      });
    } catch (error) {
      console.error('Erro durante o processo de recuperação de senha', error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Ocorreu um erro interno durante o processamento da solicitação. Tente novamente mais tarde.'
      });
    }
  }

  /**
   * @swagger
   * /v1/changepassword:
   *   post:
   *     summary: Alterar a senha do usuário
   *     description: Altera a senha do usuário com base no token fornecido, desde que o token seja válido e não tenha sido usado anteriormente.
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Token de autenticação para alteração de senha
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               newpassword:
   *                 type: string
   *                 example: "NovaSenha@123"
   *                 description: Nova senha para o usuário (mínimo 8 caracteres, incluindo pelo menos 1 letra, 1 número e 1 caractere especial)
   *     responses:
   *       200:
   *         description: Senha alterada com sucesso
   *       400:
   *         description: Este link de alteração de senha já foi utilizado ou não é mais válido. Por favor, gere um novo link.
   *       401:
   *         description: Token inválido ou expirado. Por favor, tente novamente.
   *       500:
   *         description: Ocorreu um erro interno durante o processo de mudança de senha. Tente novamente mais tarde.
   */

  async changePassword(req, res) {
    const token = req.query.token as string;
    const newpassword = req.body.newpassword as string;

    try {
      await JwtHandler.verifyToken(token, async (err, decodedUser) => {
        if (err) {
          return res.status(401).send({
            date: new Date(),
            status: false,
            data: 'Token inválido ou expirado. Por favor, tente novamente.'
          });
        }
        //Encontra usuário pelo ID.
        const userId = decodedUser.id;
        const userRepository = MysqlDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        // Verificar se existe um token utilizado associado a este usuário e ao token fornecido.
        const tokenRepository = MysqlDataSource.getRepository(Token);
        const tokenEntity = await tokenRepository.findOne({
          where: { token: token, isUsed: true, user: { id: userId } },
          relations: ['user']
        });

        if (tokenEntity) {
          return res.status(400).send({
            date: new Date(),
            status: false,
            data: 'Este link de alteração de senha já foi utilizado ou não é mais válido. Por favor, gere um novo link.'
          });
        }
        const isPasswordValid = validatePassword(newpassword);

        if (!isPasswordValid) {
          return res.status(400).send({
            date: new Date(),
            status: false,
            data: 'A senha deve conter no mínimo 8 caracteres, sendo ao menos 1 letra, 1 número e 1 caracter especial.'
          });
        }

        //Atribuir Hash a nova senha.
        const hashPassword = await bcrypt.hash(newpassword, 10);

        //Salvar a senha no banco.
        user.password = hashPassword;
        await userRepository.save(user);

        //salvar token no banco.
        const saveToken = new Token();
        saveToken.user = user;
        saveToken.isUsed = true;
        saveToken.token = token;
        tokenRepository.save(saveToken);
        return res.status(200).send({
          date: new Date(),
          status: true,
          data: 'Senha alterada com sucesso!'
        });
      });
    } catch (err) {
      console.error('Erro durante a mudança de senha.', err);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Ocorreu um erro interno durante o processo de mudança de senha. Tente novamente mais tarde.'
      });
    }
  }
}
