import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { MysqlDataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import routes from './routes';
import cron from 'node-cron';
import CategoryHandler from './utils/CategoryHandler';
import MarvelDataFormatter from './utils/MarvelDataFormatter';
import CategoryRepository from './repository/CategoryRepository';
import CategoryModel from './models/CategoryModel';
import { EmailSender } from './library/mail';
import User from './entity/User';
import Survey from './entity/Survey';
import CategoryUpdateVariables from './utils/CategoryUpdateVariables';
import { subDays, endOfDay } from 'date-fns';
import { DeepPartial } from 'typeorm';
import { CategoryClass } from './models/CategoryClassType';
import { CategoryClassAndAlias } from './models/CategoryClassAndAliasType';
import CategoryUpdate from './entity/CategoryUpdate';
import MarvelParamsDefinition from './utils/MarvelParamsDefinition';
import AxiosService from './services/AxiosService';
import CategoryUpdateRepository from './repository/CategoryUpdateRepository';
import 'dotenv/config';
import CategoryDataArrayAnsLastOffset from './models/CategoryDataArrayAnsLastOffset';
import CreateRelationsCharacterCards from './services/CreateRelationsCharacterCards';
import GetArtistsSheetToDatabase from './services/GetArtistsSheetToDatabase';
import axios from 'axios';

MysqlDataSource.initialize()
  .then(async () => {
    console.log('Database initialized!');
  })
  .catch((err) => {
    console.error('Database Error: ', err);
  });

const app = express();

const updateArtistsTable = new GetArtistsSheetToDatabase();
updateArtistsTable.getSheetToDatabase();

cron.schedule('0 0 * * *', () => {
  updateArtistsTable.getSheetToDatabase();
});

cron.schedule('0 6 * * *', async function updateSurveyDatabase() {
  console.log('atualizando banco de dados de pesquisas 1 vez por dia');

  const surveyRepository = MysqlDataSource.getRepository(Survey);
  const userRepository = MysqlDataSource.getRepository(User);

  /**
   * Pesquisas não respondidas são lançadas para usuários:
   * - criados há pelo menos 15 dias, sem pesquisas respondias, cujo último login tem data igual ou superior ao dia em que estava apto
   * a responder: 15 dias após a data de criação (para 1º pesquisa);
   * - cuja última pesquisa foi respondida há pelo menos 15 dias e último login tem data igual ou superior ao dia em que estava apto
   * a responder: 15 dias após a data de realização da última pesquisa;
   */

  try {
    // data correspondente a 15 dias antes da data atual
    const usageStartRangeTime = endOfDay(subDays(new Date(), 15));

    const dataForSurveyCreation = await userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.surveys', 'surveys')
      .innerJoinAndSelect('users.logins', 'logins')
      .select('MAX(surveys.createdAt)', 'latestSurveyDate')
      .addSelect('MAX(logins.accessDate)', 'latestLoginDate')
      .addSelect('users.createdAt', 'userCreationDate')
      .addSelect('users.id', 'userId')
      .groupBy('users.id')
      .having(
        '(userCreationDate <= :date AND latestSurveyDate IS NULL AND latestLoginDate >= DATE_ADD(userCreationDate, INTERVAL 15 DAY))',
        { date: usageStartRangeTime }
      )
      .orHaving(
        '(userCreationDate <= :date AND latestSurveyDate <= :date AND latestLoginDate >= DATE_ADD(latestSurveyDate, INTERVAL 15 DAY))',
        { date: usageStartRangeTime }
      )
      .getRawMany();

    if (dataForSurveyCreation.length) {
      // calcula média das notas para não alterá-la ao lançar pesquisas não respondidas
      // adota a mediana dos valores possíveis caso não haja pesquisas registradas
      const medianPossibleGrade: number = 3;
      const gradeAverage = (await surveyRepository.average('grade'))
        ? await surveyRepository.average('grade')
        : medianPossibleGrade;

      const newUnansweredSurveys = dataForSurveyCreation.map((data) => {
        const newSurvey: DeepPartial<Survey> = {
          grade: gradeAverage,
          user: data.userId
        };
        return newSurvey;
      });
      await surveyRepository.insert(newUnansweredSurveys);
    }
  } catch (error) {
    console.log(
      `falha na execução da atualização do banco de dados de executando tarefa novamente em 1 hora`,
      error
    );
  }
});

cron.schedule('0 7 * * *', async () => {
  const emailSender = new EmailSender();
  const userRepository = MysqlDataSource.getRepository(User);

  try {
    const currentTime = new Date();
    const timeShipping = new Date(currentTime.getTime() - 60 * 60 * 1000 * 60);
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.createdAt > :date', { date: timeShipping })
      .andWhere('user.isActivated = false')
      .getMany();

    users.forEach(async (user) => {
      await emailSender.sendConfirmationEmail(user);
    });
  } catch (error) {
    console.error('Erro ao enviar e-mails de confirmação', error);
  }
});

app.use(express.json());
app.use(cors({ origin: true }));
app.use(routes);

cron.schedule('0 8 * * *', async function updateCategoriesDatabases() {
  console.log('atualizando bancos de dados de categorias uma vez por dia');

  const categoryUpdateVariables: CategoryUpdateVariables =
    new CategoryUpdateVariables();

  const categories: CategoryClassAndAlias[] =
    categoryUpdateVariables.getCategoriesArray();

  for (const category of categories) {
    const className: CategoryClass = category.class;
    const classAlias: string = category.alias;

    const runEnviroment: string = process.env.NODE_ENV;
    const categoryUpdateRepository: CategoryUpdateRepository =
      new CategoryUpdateRepository();
    const isProdEnviroment: boolean =
      runEnviroment == categoryUpdateVariables.getRunEnvironments().PROD;

    const axios: AxiosService = new AxiosService(classAlias);
    const categoryHandler: CategoryHandler = new CategoryHandler(classAlias);
    const paramsDefiner: MarvelParamsDefinition = new MarvelParamsDefinition(
      classAlias
    );

    const categoryRepository: CategoryRepository = new CategoryRepository(
      className,
      classAlias
    );
    const records: number = await categoryRepository.count();
    const devTotalToUpdate: number = categoryUpdateVariables.devTotalToUpdate();

    const newCategoryUpdate: DeepPartial<CategoryUpdate> = {
      categoryAlias: classAlias
    };

    const marvelCategoryTotal: number = await axios.getTotal();
    const batch: number =
      marvelCategoryTotal / paramsDefiner.maxMarvelAPILimit();
    const totalRequestsToPopulate: number = Math.ceil(batch);
    const iterationsFor1000Items: number = 10;

    let modifiedSince: null | Date = null;
    let iterationsPerSaveCycle: number;
    let iterationsPerTime: number;

    if (isProdEnviroment || (!isProdEnviroment && records < devTotalToUpdate)) {
      if (isProdEnviroment) {
        if (!records) {
          const ratio: number =
            totalRequestsToPopulate / iterationsFor1000Items;
          iterationsPerSaveCycle = Math.ceil(ratio);
          iterationsPerTime =
            totalRequestsToPopulate > iterationsFor1000Items
              ? iterationsFor1000Items
              : totalRequestsToPopulate;
        } else {
          const lastUpdateDate: Date =
            await categoryUpdateRepository.getLatestUpdateByCategory(
              classAlias
            );
          modifiedSince = lastUpdateDate;
          newCategoryUpdate.specifiedDate = modifiedSince;
        }
      } else {
        iterationsPerSaveCycle = 1;
        iterationsPerTime = 1;
      }

      let totalUpdated: number = 0;
      let offsetStart: number = 0;

      try {
        do {
          const dataArrayAndLastOffset: CategoryDataArrayAnsLastOffset =
            await categoryHandler.getElements(
              offsetStart,
              iterationsPerTime,
              modifiedSince
            );

          const dataArray = dataArrayAndLastOffset.data;

          offsetStart = dataArrayAndLastOffset.lastOffset +=
            paramsDefiner.maxMarvelAPILimit();
          iterationsPerTime = totalRequestsToPopulate - iterationsFor1000Items;

          if (!dataArray.length) {
            console.log(`database ${classAlias} já atualizado`);
            break;
          } else {
            const formatter: MarvelDataFormatter = new MarvelDataFormatter();
            const formattedArray: Array<CategoryModel> =
              await formatter.formatData(dataArrayAndLastOffset.data);

            const categoryRepository: CategoryRepository =
              new CategoryRepository(className, classAlias);
            await categoryRepository.updateOrSave(formattedArray);

            totalUpdated += formattedArray.length;

            //se a categoria for personagens, realiza o relacionamento com outros cards
            if (classAlias == 'characters') {
              CreateRelationsCharacterCards.createRelations(dataArray);
            }
          }
        } while (--iterationsPerSaveCycle);

        newCategoryUpdate.totalUpdated = totalUpdated;
        await categoryUpdateRepository.save(newCategoryUpdate);
      } catch (error) {
        console.log(
          `falha na execução da atualização do banco de dados de ${classAlias}
        executando tarefa novamente em 1 dia`,
          error
        );
      }
    } else {
      console.log(`database ${classAlias} já atualizado`);
    }
  }
});

const swaggerSpec = swaggerJSDoc(swaggerConfig);

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));

console.log(`Add swagger on /swagger`);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
