import { MysqlDataSource } from '../config/database';
import Payment from '../entity/Payment';
import { DeepPartial } from 'typeorm';

/**
 * Classe que implementa operações de criação e manipulação de pagamentos no database {@link Payment}
 */
export class PaymentRepository {
  private _paymentRepository = MysqlDataSource.getRepository(Payment);

  /**
   * @constructor
   * Cria instância da classe PaymentRepository
   */
  constructor() {
    this._paymentRepository = MysqlDataSource.getRepository(Payment);
  }

  /**
   * Função de criação de novos pagamentos {@link Payment} relacionados aos usuários {@link User}
   * @async
   * @param data - objeto que contém dados para criação do pagamento
   * @returns - retorna promise Payment a ser resolvida quando da criação do pagamento no banco de dados ou rejeitada caso não seja possível criá-lo no banco
   */
  async createAndSave(data: DeepPartial<Payment>): Promise<Payment> {
    const newPayment: Payment = await this._paymentRepository.manager.save(
      Payment,
      {
        paymentId: data.paymentId,
        paymentMethod: data.paymentMethod,
        status: data.status,
        user: data.user,
        email: data.email
      }
    );
    return newPayment;
  }
}
