import { MigrationInterface, QueryRunner } from 'typeorm';
import Story from '../entity/Story';

/**
 * Classe que implementa operação de adição de histórias-teste ao banco de dados
 */
export class CreateTestStory1699915502194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Story)
      .values([
        {
          idMarvel: 10,
          enTitle:
            'In this thought-provoking anthology, a world-class collection of top comic-book creators from around the globe presents a series',
          ptTitle:
            'Nesta antologia instigante, uma coleção de classe mundial dos principais criadores de quadrinhos de todo o mundo apresenta uma série',
          description: '',
          thumb: '',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          idMarvel: 5465,
          enTitle: 'X-Men and Power Pack (2005) #2',
          ptTitle: 'X-Men e Pacote de Poder (2005) #2',
          description:
            'Quando os garotos Power partem para outra convenção científica de seu pai, eles se preparam para um dos fins de semana mais nerds de todos os tempos. Mas as coisas vão de geeks a bizarras quando o Dr. Henry P. McCoy revela uma nova invenção incrível na convenção... um dispositivo que certos membros da comunidade científica fariam de tudo para colocar as mãos! Power Pack se junta à fera saltitante de cabelo azul para uma história sobre a mente sobre a matéria!',
          thumb: '',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
