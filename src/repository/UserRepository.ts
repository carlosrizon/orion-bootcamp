import { MysqlDataSource } from '../config/database';
import * as bcrypt from 'bcrypt';
import User from '../entity/User';

export class UserRepository {
  private userRepository = MysqlDataSource.getRepository(User);

  constructor() {
    this.userRepository = MysqlDataSource.getRepository(User);
  }

  private _saltRounds = (): number => 10;

  async createAndSave(userData): Promise<User> {
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
