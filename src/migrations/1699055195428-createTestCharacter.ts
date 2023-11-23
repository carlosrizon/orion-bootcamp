import Character from '../entity/Character';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Classe que implementa operação de adição de personagens-teste ao banco de dados
 */
export class CreateTestCharacter1699055195428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Character)
      .values([
        {
          idMarvel: 11111,
          enName: 'Captain America',
          ptName: 'Capitão América',
          description: 'capitao que defende a america',
          thumb: 'http://qwdwqdq.com/qwdwqdwq.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          idMarvel: 22222,
          enName: 'Iron Man',
          ptName: 'Homem de Ferro',
          description: 'homem com armadura de ferro',
          thumb: 'http://qwdwqdq.com/qw31asddjjgwq.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
