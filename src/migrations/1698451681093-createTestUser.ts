import { MigrationInterface, QueryRunner } from 'typeorm';
import User from '../entity/User';

/**
 * Classe que implementa operação de adição de usuários-teste ao banco de dados
 */
export class CreateTestUsers1698447684549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          firstName: 'testone',
          lastName: 'da silva',
          gender: 'Homem (cis ou trans)',
          birthDate: '2001-12-05',
          email: 'betaorionisorion@gmail.com',
          password:
            '$2b$10$AEJD70.jSwKn7U.Z5dKXaO7Rbkmt7A5XfLJDWs37vJAtxgU51nT5K',
          // senha original que gerou a hash definida como variável de ambiente para realização de testes
          // No uso real o usuário passa a senha e não a hash
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          firstName: 'testtwo',
          lastName: 'dos santos',
          gender: 'Prefiro não dizer',
          birthDate: '1990-04-25',
          email: 'email@gmail.com',
          password:
            '$2b$10$WzFPvx6rTdnO3QTWk2KxWOpf4mAtqzhbq85qkbJISN8deSESj34ky',
          // senha original que gerou a hash definida como variável de ambiente para realização de testes
          // No uso real o usuário passa a senha e não a hash
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
