import User from '../entity/User';
import { MysqlDataSource } from '../config/database';
import TotalRegistrations from '../entity/TotalUserRegister';
/**
 * Classe que contabiliza e atualiza o número total de usuários cadastrados na plataforma, incluindo usuários
 * ativos e inativos.
 */
export class TotalRegisterService {
  /**
   * @type  {Repository<TotalRegistrations>} Busca o repositório das métricas de registro.
   */
  private static totalRegistrationsRepository =
    MysqlDataSource.getRepository(TotalRegistrations);

  /**
   * @type {Repository<User>} Busca o repositório de usuarios.
   */
  private static userRepository = MysqlDataSource.getRepository(User);

  /**
   * Contabiliza registros de usuários ativos, inativos e e o total.
   * @returns {Promise<void>} Uma Promise que resolve quando o método é concluído.
   */
  static async totalRegisterService(): Promise<void> {
    const repository = this.totalRegistrationsRepository;
    const existingRecord = await repository.findOne({
      where: { id: 1 }
    });

    if (existingRecord) {
      this.updateExistingRecord(existingRecord);
    } else {
      const newRecord = this.createRecord();
      await repository.save(newRecord);
    }

    // Verificar e atualizar o número total de usuários registrados
    const totalUsers = await this.totalUsersDatabase();
    if (existingRecord && existingRecord.totalRegistrations !== totalUsers) {
      existingRecord.totalRegistrations = totalUsers;
      await repository.save(existingRecord);
    }

    //Verificar e atualizar o número total de usuários ativos.
    const activateUsers = await this.totalUsersActiveDatabase();
    if (
      existingRecord &&
      existingRecord.activeRegistrations !== activateUsers
    ) {
      existingRecord.activeRegistrations = activateUsers;
      await repository.save(existingRecord);
    }

    // Verificar e atualizar o banco com o número total de usuários inativos
    const inactivateUsers = await this.totalUsersInactiveDatabase();
    if (
      existingRecord &&
      existingRecord.inactiveRegistrations !== inactivateUsers
    ) {
      existingRecord.inactiveRegistrations = inactivateUsers;
      await repository.save(existingRecord);
    }
  }
  /**
   * @returns {Promise<number>} Retorna o número total de usuários cadastrados.
   */
  private static async totalUsersDatabase(): Promise<number> {
    const usersRepository = this.userRepository;
    const totalUsers = await usersRepository.count();
    return totalUsers;
  }
  /**
   * @returns {Promise<number>} Retorna o número de usuários ativos na plataforma.
   */
  private static totalUsersActiveDatabase(): Promise<number> {
    const usersRepository = this.userRepository;
    const activateUsers = usersRepository.count({
      where: { isActivated: true }
    });
    return activateUsers;
  }
  /**
   * @returns {Promise<number>} Retorna o número de usuários inativos na plataforma.
   */
  private static totalUsersInactiveDatabase(): Promise<number> {
    const usersRepository = this.userRepository;
    const inactivateUsers = usersRepository.count({
      where: { isActivated: false }
    });
    return inactivateUsers;
  }
  /**
   * Atualiza o número total de usuários cadastrados e soma um usuário inativo.
   * @param record Registro existente de TotalRegistrations a ser atualizado.
   */
  private static updateExistingRecord(record: TotalRegistrations) {
    record.totalRegistrations += 1;
    record.inactiveRegistrations += 1;
    this.totalRegistrationsRepository.save(record);
  }

  /**
   * @returns {TotalRegistrations} Retorna um novo registro de TotalRegistrations caso ainda não tenha.
   */
  private static createRecord(): TotalRegistrations {
    const newRecord = new TotalRegistrations();
    newRecord.totalRegistrations = 1;
    newRecord.inactiveRegistrations = 1;
    return newRecord;
  }

  /**
   *  @returns {Promise<void>} Soma um novo usuário ativo e subtrai um usuário inativo
   * da tabela de métricas após o usuário ativar sua conta.
   */
  static async updateActiveUsers(): Promise<void> {
    const repository = this.totalRegistrationsRepository;
    const existingTotalRegistrations = await repository.findOne({
      where: { id: 1 }
    });

    if (existingTotalRegistrations) {
      existingTotalRegistrations.activeRegistrations += 1;
      existingTotalRegistrations.inactiveRegistrations -= 1;
      await repository.save(existingTotalRegistrations);
    }
  }
}
