import { MigrationInterface, QueryRunner } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import Survey from '../entity/Survey';
import User from '../entity/User';

/**
 * Classe que implementa operação de adição de pesquisas-teste ao banco de dados
 */
export class CreateTestSurvey1700686573986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = MysqlDataSource.getRepository(User);

    // Buca usuários testes implementados por migration para relacioná-los com as surveys testes
    const userTestone = await userRepository.findOne({
      where: { firstName: 'testone' }
    });
    const userTestTwo = await userRepository.findOne({
      where: { firstName: 'testtwo' }
    });

    if (userTestone && userTestTwo) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Survey)
        .values([
          {
            comment: 'Melhor plataforma de conteúdos sobre a Marvel do Brasil!',
            grade: 5,
            user: userTestone,
            answered: true,
            createdAt: new Date()
          },
          {
            comment: 'Adorando o conteúdo!',
            grade: 5,
            user: userTestTwo,
            answered: true,
            createdAt: new Date()
          }
        ])
        .execute();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
