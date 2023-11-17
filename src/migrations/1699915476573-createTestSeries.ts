import { MigrationInterface, QueryRunner } from 'typeorm';
import Series from '../entity/Series';

export class CreateTestSeries1699915476573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Series)
      .values([
        {
          idMarvel: 29695,
          enTitle: '2020 Machine Man (2020)',
          ptTitle: 'Homem Máquina 2020 (2020)',
          description:
            'A IA a revolta começou e o Homem-Máquina se vê dividido sobre seu lugar na revolução! À medida que a batalha avança ao seu redor, o Homem-Máquina ajudará a humanidade na luta pela sobrevivência ou se juntará a seus irmãos robôs no início de uma nova era? Além disso, quando confrontado com uma figura do seu passado, o Homem-Máquina deve decidir: é hora de seguir a sua programação ou o seu coração? Não perca esta aventura épica de Christos Gage e Andy MacDonald! Além disso, revisite Machine Man em 2020 com o lendário criador Tom DeFalco!',
          thumb:
            'http://i.annihil.us/u/prod/marvel/i/mg/5/70/5f5bef0fafd3e.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          idMarvel: 29697,
          enTitle: '2020 iWolverine (2020)',
          ptTitle: '2020 e Wolverine (2020)',
          description:
            'Após a cruzada de Arno Stark contra as IAs, nenhum robô está seguro. Temendo pela segurança de Elsie Dee nestes tempos tumultuados, Albert, o robô Wolverine, vai até Madripoor para encontrá-la... mas o que ele encontra é uma luta contra o ponto fraco do crime de Madripoor!',
          thumb:
            'http://i.annihil.us/u/prod/marvel/i/mg/9/20/5f4037d30efa5.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
