import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../entity/User';
import 'dotenv/config';

export class EmailSender {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public async sendConfirmationEmail(user: User): Promise<void> {
    const token: string = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        algorithm: 'HS256',
        expiresIn: '72h'
      }
    );
    try {
      await this.transporter.sendMail({
        from: 'MarvelPedia <marvelpediaorion@hotmail.com>',
        to: user.email,
        subject: 'MarvelPedia - Confirme seu cadastro!',
        html: `<h2>Olá ${user.firstName}!</h2>
        <p>Agradecemos por se juntar à comunidade Marvel! Para confirmar seu cadastro, clique no link abaixo:</p><br>
        <h3><p><a href="http://localhost:4200/redirect?token=${token}">Confirmar cadastro</a></p></h3><br>
        <p>Se você não solicitou este e-mail, por favor, ignore-o. Caso contrário, esperamos que aproveite a exploração do vasto universo da Marvel em nosso site.</p>
        <p>Em caso de dúvidas ou problemas, nossa equipe de suporte está à disposição para ajudar.</p>
        <p>Divirta-se!</p><br>
        <p>Atenciosamente,</p>
        <p>A Equipe MarvelPedia</p>
        `,
        text: 'Olá, Para confirmar seu cadastro, clique no link abaixo:'
      });
      console.log('Email Enviado com sucesso.');
    } catch (err) {
      console.error('Erro ao enviar email:', err);
    }
  }

  public async sendPasswordRecoveryEmail(user: User): Promise<void> {
    const token: string = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        algorithm: 'HS256',
        expiresIn: '72h'
      }
    );
    try {
      await this.transporter.sendMail({
        from: 'MarvelPedia <marvelpediaorion@hotmail.com>',
        to: user.email,
        subject: 'MarvelPedia - Recuperação de senha',
        html: `<h2>Olá ${user.firstName}</h2>
        <p>Recebemos sua solicitação de recuperação de senha. Para criar uma nova senha, clique no link abaixo:</p><br>
        <h3><p><a href="http://localhost:4200/change-password?token=${token}">Recuperar senha</a></p></h3><br>
        <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail, por motivos de segurança.</p>
        <p>Em caso de dúvidas ou problemas, nossa equipe de suporte está à disposição para ajudar.</p>
        <p>Tenha um ótimo dia!</p><br>
        <p>Atenciosamente,</p>
        <p>A Equipe MarvelPedia</p>
        `,
        text: 'Olá, Para mudar sua senha, clique no link abaixo:'
      });
      console.log('Email de mudança de senha enviado com sucesso.');
    } catch (err) {
      console.error('Erro ao enviar email de mudança de senha.', err);
    }
  }
}
