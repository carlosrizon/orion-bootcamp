import { MigrationInterface, QueryRunner } from 'typeorm';
import Comic from '../entity/Comic';

export class CreateTestComic1699915059110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Comic)
      .values([
        {
          idMarvel: 384,
          enTitle: 'Gun Theory (2003) #3',
          ptTitle: 'Teoria das Armas (2003) #3',
          description:
            'O telefone toca e o assassino de aluguel Harvey embarca em outro golpe. Mas nada está dando certo neste trabalho. Há pouco espaço para erros no negócio de matar - então o que acontece quando um erro ocorre?32 PGS./CONSULTORIA PARA OS PAIS...$2,50',
          thumb:
            'http://i.annihil.us/u/prod/marvel/i/mg/c/60/4bc69f11baf75.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        {
          idMarvel: 428,
          enTitle: 'Ant-Man (2003) #4',
          ptTitle: 'Homem-Formiga (2003) #4',
          description:
            'O Homem-Formiga se aprofunda para descobrir quem está vazando aqueles segredinhos sujos que ameaçam nossa segurança nacional. E quem é melhor em descobrir SEGREDOS sujos do que ele?',
          thumb:
            'http://i.annihil.us/u/prod/marvel/i/mg/4/20/4bc697c680890.jpg',
          isTranslated: true,
          createdAt: new Date(),
          lastUpdate: new Date()
        }
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
