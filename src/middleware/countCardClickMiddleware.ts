import { UserCharacterClicks } from '../entity/UserCharacterClicks';
import { UserComicClicks } from '../entity/UserComicClicks';
import { UserSeriesClicks } from '../entity/UserSeriesClicks';
import { UserStoryClicks } from '../entity/UserStoryClicks';
import { UserEventClicks } from '../entity/UserEventClicks';
import { Category, insertNewClickMetric } from '../utils/cardsMetricsUtils';
import { MysqlDataSource } from '../config/database';
import User from '../entity/User';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Story from '../entity/Story';
import Event from '../entity/Event';

/**
 * Middleware que realiza a contabilização do clique no card pelo usuário
 *
 * @param {Object} req - Objeto de requisição express.
 * @param {Object} res - Objeto de resposta express.
 * @param {function} next - Função para chamar o próximo middleware/controller na cadeia.
 */
export async function countCardClick(req, res, next) {
  try {
    const cardCategory: Category = req.params.category as Category;
    const category_id: number = Number(req.params.category_id);
    const user_id: number = req.body.user.id;

    const userRepository = MysqlDataSource.getRepository(User);

    let statusCode, resp;

    //resposta padrão
    statusCode = 200;
    resp = {
      date: new Date(),
      status: true,
      data:
        'O usuário ' +
        user_id +
        ' selecionou o recurso ' +
        category_id +
        " da categoria '" +
        cardCategory +
        "'."
    };

    let metricsRepository, categoryRepository;
    let metricEntry;

    switch (cardCategory) {
      case Category.Characters:
        categoryRepository = MysqlDataSource.getRepository(Character);
        metricsRepository = MysqlDataSource.getRepository(UserCharacterClicks);

        //procura para ver se a métrica já existe
        metricEntry = await metricsRepository.findOne({
          where: { user: { id: user_id }, character: { id: category_id } }
        });

        if (metricEntry) {
          //metrica já existe
          metricEntry.clicks += 1;
          await metricsRepository.save(metricEntry);
        } else {
          //métrica é criada
          ({ statusCode, resp } = await insertNewClickMetric(
            cardCategory,
            new UserCharacterClicks(),
            userRepository,
            categoryRepository,
            user_id,
            category_id
          ));
        }

        break;

      case Category.Comics:
        categoryRepository = MysqlDataSource.getRepository(Comic);
        metricsRepository = MysqlDataSource.getRepository(UserComicClicks);

        metricEntry = await metricsRepository.findOne({
          where: { user: { id: user_id }, comic: { id: category_id } }
        });

        if (metricEntry) {
          metricEntry.clicks += 1;
          await metricsRepository.save(metricEntry);
        } else {
          ({ statusCode, resp } = await insertNewClickMetric(
            cardCategory,
            new UserComicClicks(),
            userRepository,
            categoryRepository,
            user_id,
            category_id
          ));
        }

        break;

      case Category.Series:
        categoryRepository = MysqlDataSource.getRepository(Series);
        metricsRepository = MysqlDataSource.getRepository(UserSeriesClicks);

        metricEntry = await metricsRepository.findOne({
          where: { user: { id: user_id }, series: { id: category_id } }
        });

        if (metricEntry) {
          metricEntry.clicks += 1;
          await metricsRepository.save(metricEntry);
        } else {
          ({ statusCode, resp } = await insertNewClickMetric(
            cardCategory,
            new UserSeriesClicks(),
            userRepository,
            categoryRepository,
            user_id,
            category_id
          ));
        }

        break;

      case Category.Stories:
        categoryRepository = MysqlDataSource.getRepository(Story);
        metricsRepository = MysqlDataSource.getRepository(UserStoryClicks);

        metricEntry = await metricsRepository.findOne({
          where: { user: { id: user_id }, story: { id: category_id } }
        });

        if (metricEntry) {
          metricEntry.clicks += 1;
          await metricsRepository.save(metricEntry);
        } else {
          ({ statusCode, resp } = await insertNewClickMetric(
            cardCategory,
            new UserStoryClicks(),
            userRepository,
            categoryRepository,
            user_id,
            category_id
          ));
        }

        break;

      case Category.Events:
        categoryRepository = MysqlDataSource.getRepository(Event);
        metricsRepository = MysqlDataSource.getRepository(UserEventClicks);

        metricEntry = await metricsRepository.findOne({
          where: { user: { id: user_id }, event: { id: category_id } }
        });

        if (metricEntry) {
          metricEntry.clicks += 1;
          await metricsRepository.save(metricEntry);
        } else {
          ({ statusCode, resp } = await insertNewClickMetric(
            cardCategory,
            new UserEventClicks(),
            userRepository,
            categoryRepository,
            user_id,
            category_id
          ));
        }

        break;
    }

    //return res.status(statusCode).send(resp);

    next();
  } catch (error) {
    return res.status(500).send({
      date: new Date(),
      status: false,
      data: 'Um erro interno ocorreu.'
    });
  }
}
