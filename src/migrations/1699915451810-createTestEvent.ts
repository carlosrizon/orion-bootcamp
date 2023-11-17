import { MigrationInterface, QueryRunner } from 'typeorm';
import Event from '../entity/Event';

export class CreateTestEvent1699915451810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Event)
      .values([
        {
          idMarvel: 116,
          enTitle: 'Acts of Vengeance!',
          ptTitle: 'Atos de vingança!',
          description:
            'Loki começa a convencer os supervilões da Terra a atacar outros heróis além daqueles com quem eles normalmente lutam, na tentativa de destruir os Vingadores para absolver sua culpa por ter criado inadvertidamente a equipe em primeiro lugar.',
          thumb:
            'http://i.annihil.us/u/prod/marvel/i/mg/9/40/51ca10d996b8b.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          idMarvel: 227,
          enTitle: 'Age of Apocalypse',
          ptTitle: 'Era do Apocalipse',
          description:
            'Numa versão distorcida do mundo que conheciam, os X-Men lutam contra o eterno mutante Apocalipse enquanto Bishop procura reparar a linha do tempo. Legion, filho do próprio Xavier, tenta matar todos os inimigos de Xavier; no entanto, quando Legion tenta assassinar Magneto, Xavier sacrifica sua própria vida para salvar Magnus. Como resultado, Magneto abandona seus sentimentos anti-humanos e dá continuidade ao sonho de Xavier de coexistência pacífica, fundando assim os X-Men.',
          thumb:
            'hhttp://i.annihil.us/u/prod/marvel/i/mg/5/e0/51ca0e08a6546.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
