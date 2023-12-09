import { Request, Response } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import 'dotenv/config';
import { randomUUID } from 'crypto';
import { MysqlDataSource } from '../config/database';
import { DeepPartial } from 'typeorm';
import User from '../entity/User';
import Payments from '../entity/payment';
import QRCode from 'qrcode';
import { EmailSender } from '../library/mail';

const mercadoPagoToken = process.env.TOKEN_MERCADOPAGO;
const client = new MercadoPagoConfig({ accessToken: mercadoPagoToken });
const payment = new Payment(client);

export class PaymentController {
  async reciveNotificationPayment(req: Request, res: Response) {
    const userRepository = await MysqlDataSource.getRepository(User);
    const paymentRepository = await MysqlDataSource.getRepository(Payments);
    const notification = req.body;
    console.log(notification);

    if (
      notification.action === 'payment.created' &&
      notification.type === 'payment'
    ) {
      return res.status(201).send({
        date: new Date(),
        status: true,
        data: 'Pagamento foi criado.'
      });
    }
    if (
      notification.action === 'payment.updated' &&
      notification.type === 'payment'
    ) {
      const paymentId = notification.data.id;
      const dataPayment = await payment.get({
        id: paymentId
      });
      const statusPayment = await dataPayment.status;
      console.log(statusPayment); // Mostrar status do pagamento no terminal
      if (statusPayment === 'approved') {
        const paymentRecord = await paymentRepository.findOneBy({
          paymentId: paymentId
        });
        if (paymentRecord) {
          paymentRecord.status = 'approved';
          await MysqlDataSource.manager.save(paymentRecord);
        }
        return res.status(200).send({
          date: new Date(),
          status: true,
          data: 'Pagamento aprovado com sucesso.'
        });
      }
      console.log(dataPayment);
    }

    return res.status(500).send({
      date: new Date(),
      status: false,
      data: 'Ocorreu um erro interno no servidor.'
    });
  }

  async createPayment(req: Request, res: Response) {
    try {
      const user_email = req.body.email;
      const paymentRepository = await MysqlDataSource.getRepository(Payments);
      const userRepository = await MysqlDataSource.getRepository(User);
      const notification_url =
        'https://ba17-177-188-46-238.ngrok-free.app/v1/paymentnotifications'; //Endpoint onde o webooks envia notificações do pagamento.
      const description = 'Marvelpedia - Adquirir um pôster exclusivo!';
      const idempotencyKey = randomUUID(); //Key única aleatória para identificação de cada pedido.

      const result = await payment.create({
        body: {
          transaction_amount: 1.0,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: req.body.email
          },
          notification_url: notification_url
        },
        requestOptions: { idempotencyKey: idempotencyKey }
      });

      const user = await userRepository.findOneBy({ email: user_email });
      const paymentEntity = new Payments();
      paymentEntity.paymentId = result.id;
      paymentEntity.status = result.status;
      paymentEntity.user = user;
      paymentEntity.email = user_email;
      paymentEntity.qrcode =
        result.point_of_interaction.transaction_data.qr_code;

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
