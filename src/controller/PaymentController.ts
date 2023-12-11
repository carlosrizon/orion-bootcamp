import { Request, Response } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import 'dotenv/config';
import { randomUUID } from 'crypto';
import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import Payments from '../entity/Payment';
import { EmailSender } from '../library/mail';

const mercadoPagoToken = process.env.TOKEN_MERCADOPAGO;
const NOTIFICATION_WEBHOOK = process.env.NOTIFICATION_WEBHOOK;
const PIX_VALUE = process.env.PIX_VALUE;
const client = new MercadoPagoConfig({ accessToken: mercadoPagoToken });
const payment = new Payment(client);
export class PaymentController {
  /**
   * @swagger
   *
   * /v1/paymentnotifications:
   *   post:
   *     summary: recebe notificações do gateway de pagamento
   *     description: recebe notificações do gateway de pagamento com atualizações
   *     tags: [Payment Notifications]
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da efetivação do pagamento
   *                 data:
   *                   type: string
   *                   description: Mensagem de sucesso
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: true
   *                 data: Pagamento aprovado com sucesso.
   *
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da efetivação do pagamento
   *                 data:
   *                   type: string
   *                   description: Mensagem de erro
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: true
   *                 data: 'Ocorreu um erro interno no servidor.'
   */
  async reciveNotificationPayment(req: Request, res: Response) {
    const paymentRepository = MysqlDataSource.getRepository(Payments);
    const notification = req.body;
    const paymentId = notification?.data?.id;
    if (
      notification.action === 'payment.created' &&
      notification.type === 'payment'
    ) {
      return res.status(201).send({
        date: new Date(),
        status: true,
        data: 'Pagamento foi criado.'
      });
    } else if (
      notification.action === 'payment.updated' &&
      notification.type === 'payment' &&
      paymentId
    ) {
      const dataPayment = await payment.get({
        id: paymentId
      });

      const statusPayment = await dataPayment.status;

      if (paymentId && statusPayment === 'approved') {
        const paymentRecord = await paymentRepository.findOneBy({
          paymentId: Number(paymentId)
        });
        if (paymentRecord) {
          paymentRecord.status = 'approved';
          await MysqlDataSource.manager.save(paymentRecord);
        }
        if (paymentRecord?.user?.email) {
          new EmailSender().sendPaymentConfirmationEmail(paymentRecord.user);
        }

        return res.status(200).send({
          date: new Date(),
          status: true,
          data: 'Pagamento aprovado com sucesso.'
        });
      }
    }

    if (paymentId) {
      const paymentRecord = await paymentRepository.findOneBy({
        paymentId: Number(paymentId)
      });
      if (paymentRecord?.user?.email) {
        new EmailSender().sendPaymentFailureEmail(paymentRecord.user);
      }
    }

    return res.status(500).send({
      date: new Date(),
      status: false,
      data: 'Ocorreu um erro interno no servidor.'
    });
  }

  /**
   * @swagger
   *
   * /v1/createpayment:
   *   post:
   *     summary: cria novo pagamento para o usuário
   *     description: cria novo pagamento para o usuário e envia e-mail com link para pagamento via pix da compra
   *     security:
   *       - BearerAuth: []
   *     tags: [Create Payment]
   *     produces:
   *       - application/json
   *     responses:
   *       '201':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *               properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da criação do pagamento
   *                 data:
   *                   type: number
   *                   description: PaymentId do pagamento criado
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: true
   *                 data: 68434960766
   *
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                 date:
   *                   type: date
   *                   description: Data de envio da resposta à requisição
   *                 status:
   *                   type: boolean
   *                   description: Status da criação do pagamento
   *                 data:
   *                   type: string
   *                   description: Mensagem de erro
   *               example:
   *                 date: 2023-10-28T19:59:19.751Z
   *                 status: true
   *                 data: 'Erro ao criar pagamento.'
   *
   */
  async createPayment(req: Request, res: Response) {
    try {
      const user_id = req.body.user.id;
      const paymentRepository = await MysqlDataSource.getRepository(Payments);
      const userRepository = await MysqlDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: user_id });
      const notification_url = `${NOTIFICATION_WEBHOOK}/v1/paymentnotifications`;
      const description = 'Marvelpedia - Adquirir um pôster exclusivo!';
      const idempotencyKey = randomUUID();

      const result = await payment.create({
        body: {
          transaction_amount: Number(process.env.PIX_VALUE) || 1.0,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: user.email
          },
          notification_url: notification_url
        },
        requestOptions: { idempotencyKey: idempotencyKey }
      });

      const paymentEntity = new Payments();
      paymentEntity.paymentId = result.id;
      paymentEntity.status = result.status;
      paymentEntity.user = user;
      (paymentEntity.email = user.email),
        (paymentEntity.qrcode =
          result.point_of_interaction.transaction_data.qr_code);

      await MysqlDataSource.manager.save(paymentEntity);
      new EmailSender().sendQrcodePayment(result.id, user);
      return res
        .status(200)
        .send({ message: 'Pagamento criado com sucesso.', data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Erro ao criar pagamento.' });
    }
  }
}
