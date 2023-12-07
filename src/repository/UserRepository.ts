import { MysqlDataSource } from '../config/database';
import * as bcrypt from 'bcrypt';
import User from '../entity/User';
import { DeepPartial } from 'typeorm';

/**
 * Classe que implementa operações de criação e manipulação de usuários no database {@link User}
 */
export class UserRepository {
  private userRepository = MysqlDataSource.getRepository(User);

  /**
   * @constructor
   * Cria instância da classe UserRepository
   */
  constructor() {
    this.userRepository = MysqlDataSource.getRepository(User);
  }

  private _saltRounds = (): number => 10;

  /**
   * Função de criação de novos unuários no database {@link User}
   * @async
   * @param userData - objeto que contém dados para criação de susuário
   * @returns - retorna promise User a ser resolvida quando da criação do usuário no banco de dados ou rejeitada caso não seja possível criá-lo no banco
   */
  async createAndSave(userData: DeepPartial<User>): Promise<User> {
    const hashpassword = await bcrypt.hash(
      userData.password,
      this._saltRounds()
    );

    const newUser: User = await this.userRepository.manager.save(User, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      birthDate: userData.birthDate,
      email: userData.email,
      password: hashpassword
    });

    return newUser;
  }

  /**
   * Função que implementa busca no database {@link User} e retorna instância de usuário a partir da propriedade email ou ID do usuário
   * @async
   * @param {string | number} value - valor conhecido da propriedade indicada para busca do usuário
   * @param {string} property - indicação da propriedade (ID ou e-mail) a ser utilizada na busca
   * @returns - Promise User a ser resolvida quando encontrado o usuário ou rejeitada caso este não exista
   */
  async findUserByEmailOrID(
    value: string | number,
    property: string
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { [property]: value }
    });
    return user;
  }
}
