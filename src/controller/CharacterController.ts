import { Request, Response } from 'express';
import User from '../entity/User';
import { MysqlDataSource } from '../config/database';
import Character from '../entity/Character';
import Comic from '../entity/Comic';
import Series from '../entity/Series';
import Story from '../entity/Story';
import Event from '../entity/Event';
import { Repository } from 'typeorm';
import { Category, insertNewClickMetric } from '../utils/cardsMetricsUtils';
import { UserFavorites } from '../entity/UserFavorites';
import { CharacterComics } from '../entity/CharacterComics';
import {
  getComicsByCharacter,
  getEventsByCharacter,
  getSeriesByCharacter,
  getStoriesByCharacter
} from '../utils/cardsDetailsUtils';
import CategoryModel from '../models/CategoryInterface';

/**
 * Classe com operações relacionadas à operações relacionadas a cards exibidos na aplicação
 */
//TODO: alterar nome do controller para algo como CardsController (sugestão)
export class CharacterController {
  /**
   * @swagger
   *
   * /v1/{category}/{category_id}:
   *   get:
   *
   *     summary: Requisita informações sobre um card
   *     description: Retorna detalhes sobre um card selecionado e realiza a contabilização da métrica de cliques por usuário por card
   *     security:
   *       - BearerAuth: []
   *     tags: [Characters]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum:
   *             - characters
   *             - comics
   *             - series
   *             - stories
   *             - events
   *       - in: path
   *         name: category_id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: o ID do recurso
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: true
   *                 data: 'O usuário 4 selecionou o recurso 1 da categoria characters'
   *       '404':
   *           description: 'Requisição falhou.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Recurso não encontrado."
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Um erro interno ocorreu."
   *
   */
  async getCardDetails(req: Request, res: Response) {
    try {
      const cardCategory: Category = req.params.category as Category;
      const category_id: number = Number(req.params.category_id);

      if (cardCategory === Category.Characters) {
        //encontrar o character
        const characterRepository = MysqlDataSource.getRepository(Character);

          const character: Character = await characterRepository.findOne({
            where: {
              id: category_id
            }
          });

          //pegar todos as series, eventos, stories e comics do character selecionado
          const series = await getSeriesByCharacter(character);
          const events = await getEventsByCharacter(character);
          const stories = await getStoriesByCharacter(character);
          const comics = await getComicsByCharacter(character);

        const objResp = {
          characterName: character.enName,
          characterDescription: character.description,
          characterThumb: character.thumb,
          comicsList: comics,
          seriesList: series,
          storiesList: stories,
          eventsList: events
        };

        return res
          .status(200)
          .send({ date: new Date(), status: true, data: objResp });
      } else if (
        cardCategory == Category.Comics ||
        cardCategory == Category.Series ||
        cardCategory == Category.Stories ||
        cardCategory == Category.Events
      ) {
        let item: CategoryModel;

        //encontra o recurso
        switch (cardCategory) {
          case Category.Comics:
            const comicsRepository = MysqlDataSource.getRepository(Comic);
            item = await comicsRepository.findOne({
              where: {
                id: category_id
              }
            });
            break;
          case Category.Series:
            const seriesRepository = MysqlDataSource.getRepository(Series);
            item = await seriesRepository.findOne({
              where: {
                id: category_id
              }
            });
            break;
          case Category.Stories:
            const storiesRepository = MysqlDataSource.getRepository(Story);
            item = await storiesRepository.findOne({
              where: {
                id: category_id
              }
            });
            break;
          case Category.Events:
            const eventsRepository = MysqlDataSource.getRepository(Event);
            item = await eventsRepository.findOne({
              where: {
                id: category_id
              }
            });
            break;
        }

        const objResp = {
          title: item.enTitle,
          description: item.description,
          thumb: item.thumb,
          link: 'http://mock-pagina-de-detalhes.com'
        };

        return res.status(200).send({
          date: new Date(),
          status: true,
          data: objResp
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }

  /**
   * @swagger
   *
   * /v1/{category}:
   *   get:
   *
   *     summary: Requisita páginas de uma categoria especificada
   *     description: Retorna uma quantidade de 9 cards por página da categoria especificada
   *     security:
   *       - BearerAuth: []
   *     tags: [Characters]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum:
   *             - characters
   *             - comics
   *             - series
   *             - stories
   *             - events
   *         description: Categoria desejada
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Página desejada
   *       - in: query
   *         name: search
   *         required: false
   *         schema:
   *           type: string
   *         description: Texto de busca especificado
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: true
   *                 data: <ARRAY DE OBJETOS JSON>
   *       '404':
   *           description: 'Requisição falhou.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Página não encontrada."
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Um erro interno ocorreu."
   *
   */
  async getPage(req: Request, res: Response) {
    try {
      const pageCategory: Category = req.params.category as Category;
      const pageNumber: number = Number(req.query.page) || 1;
      const searchText: string = (req.query.search as string) || '';

      const offset = (pageNumber - 1) * 9;
      const limit = 9;

      let found;

      switch (pageCategory) {
        case Category.Characters:
          const charactersRepository = MysqlDataSource.getRepository(Character);

          found = await charactersRepository
            .createQueryBuilder('characters')
            .where(
              'characters.enName LIKE :character_name OR characters.ptName LIKE :character_name OR characters.description LIKE :character_name',
              {
                character_name: `%${searchText}%`
              }
            );

          break;

        case Category.Comics:
          const comicsRepository = MysqlDataSource.getRepository(Comic);

          found = await comicsRepository
            .createQueryBuilder('comics')
            .where(
              'comics.enTitle LIKE :comic_title OR comics.ptTitle LIKE :comic_title OR comics.description LIKE :comic_title',
              {
                comic_title: `%${searchText}%`
              }
            );

          break;

        case Category.Series:
          const seriesRepository = MysqlDataSource.getRepository(Series);

          found = await seriesRepository
            .createQueryBuilder('series')
            .where(
              'series.enTitle LIKE :series_title OR series.ptTitle LIKE :series_title OR series.description LIKE :series_title',
              {
                series_title: `%${searchText}%`
              }
            );

          break;

        case Category.Stories:
          const storiesRepository = MysqlDataSource.getRepository(Story);

          found = await storiesRepository
            .createQueryBuilder('stories')
            .where(
              'stories.enTitle LIKE :story_title OR stories.ptTitle LIKE :story_title OR stories.description LIKE :story_title',
              {
                story_title: `%${searchText}%`
              }
            );

          break;
        case Category.Events:
          const eventsRepository = MysqlDataSource.getRepository(Event);

          found = await eventsRepository
            .createQueryBuilder('events')
            .where(
              'events.enTitle LIKE :event_title OR events.ptTitle LIKE :event_title OR events.description LIKE :event_title',
              {
                event_title: `%${searchText}%`
              }
            );

          break;
      }

      const cards = await found.skip(offset).take(limit).getMany();

      if (cards.length === 0) {
        return res.status(404).send({
          date: new Date(),
          status: false,
          data: 'Página não encontrada.'
        });
      }

      //adicionar parametro boolen favorited nos cards de personagens
      if (pageCategory == Category.Characters) {
        const userFavoritesRepository =
          MysqlDataSource.getRepository(UserFavorites);

        //obtem os IDs dos personagens favoritados pelo usuário
        const userFavoriteCharacterIds = (
          await userFavoritesRepository
            .createQueryBuilder('userFavorites')
            .select('userFavorites.character')
            .where('userFavorites.user.id = :user_id', {
              user_id: req.body.user.id
            })
            .getRawMany()
        ).map((item) => item.character_id);

        //verifica se o id do card está no array de IDs favoritos dele
        const cardsWithFavorited = cards.map((card) => ({
          ...card,
          favorited: userFavoriteCharacterIds.includes(card.id)
        }));

        return res.status(200).json({
          date: new Date(),
          status: true,
          data: cardsWithFavorited
        });
      }

      return res
        .status(200)
        .json({ date: new Date(), status: true, data: cards });
    } catch (error) {
      console.log('Erro: ', error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }

  /**
   * @swagger
   *
   * /v1/favorites:
   *   get:
   *
   *     summary: Requisita página de favoritos do usuário
   *     description: Retorna uma quantidade de 9 cards por página
   *     security:
   *       - BearerAuth: []
   *     tags: [Characters]
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Página desejada
   *       - in: query
   *         name: search
   *         required: false
   *         schema:
   *           type: string
   *         description: Texto de busca especificado
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: true
   *                 data: <ARRAY DE OBJETOS JSON>
   *       '404':
   *           description: 'Requisição falhou.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Página não encontrada."
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Um erro interno ocorreu."
   *
   */
  async getFavoritesPage(req: Request, res: Response) {
    try {
      const pageNumber: number = Number(req.query.page) || 1;
      const searchText: string = (req.query.search as string) || '';

      const offset = (pageNumber - 1) * 9;
      const limit = 9;

      const charactersRepository = MysqlDataSource.getRepository(Character);

      const user_id: number = req.body.user.id;

      //faz join de user_favorites e characters e pega apenas os personagens do usuário atual
      const found = MysqlDataSource.getRepository(UserFavorites)
        .createQueryBuilder('userFavorites')
        .innerJoinAndSelect('userFavorites.character', 'character')
        .innerJoinAndSelect('userFavorites.user', 'user')
        .where(
          '(character.enName LIKE :character_name OR character.ptName LIKE :character_name OR character.description LIKE :character_name) AND user.id = :user_id',
          {
            character_name: `%${searchText}%`,
            user_id: user_id
          }
        )
        .select([
          'character.id AS id',
          'character.idMarvel AS idMarvel',
          'character.enName AS enName',
          'character.ptName AS ptName',
          'character.description AS description',
          'character.thumb AS thumb',
          'character.isTranslated AS isTranslated',
          'character.createdAt AS createdAt',
          'character.lastUpdate AS lastUpdate'
        ]);

      const cards = await found.skip(offset).take(limit).getRawMany();

      if (cards.length === 0) {
        return res.status(404).send({
          date: new Date(),
          status: false,
          data: 'Página não encontrada.'
        });
      }

      //adicionar parametro boolen favorited nos cards já favoritados
      const cardsWithFavorited = cards.map((card) => ({
        ...card,
        favorited: true
      }));

      return res
        .status(200)
        .json({ date: new Date(), status: true, data: cardsWithFavorited });
    } catch (error) {
      console.log('Erro: ', error);
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }

  /**
   * @swagger
   *
   * /v1/favorite:
   *   post:
   *     summary: Favorita ou desfavorita um personagem especificado para o usuário corrente
   *     description: Se o personagem não tiver sido favoritado pelo usuário antes, uma entrada de favorito dele é criada.
   *                   Caso contrário, se o personagem já tiver sido favoritado anteriormente, sua entrada de favorito é removida.
   *     security:
   *       - BearerAuth: []
   *     tags: [Characters]
   *     requestBody:
   *       description: Envio do ID do personagem a ser favoritado/desfavoritado
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               character_id:
   *                 type: number
   *             example:
   *               character_id: 1
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       '200':
   *           description: 'Requisição bem sucedida.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: true
   *                 data: 'O usuário 4 favoritou o personagem 1'
   *       '404':
   *           description: 'Requisição falhou.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Personagem não encontrado."
   *       '500':
   *           description: 'Erro interno.'
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   date:
   *                     type: object
   *                   status:
   *                     type: boolean
   *                   data:
   *                     type: string
   *                     description: 'objeto json de retorno'
   *               example:
   *                 date: {}
   *                 status: false
   *                 data: "Um erro interno ocorreu."
   *
   */
  async favoriteCharacter(req: Request, res: Response) {
    try {
      const character_id: number = Number(req.body.character_id);
      const user_id: number = req.body.user.id;

      const userRepository = MysqlDataSource.getRepository(User);
      const characterRepository = MysqlDataSource.getRepository(Character);
      const userFavoritesRepository =
        MysqlDataSource.getRepository(UserFavorites);

      //procura para ver se a entrada de favorito já existe
      const favoriteEntry = await userFavoritesRepository.findOne({
        where: { user: { id: user_id }, character: { id: character_id } }
      });

      if (favoriteEntry) {
        //remove dos favoritos
        await MysqlDataSource.manager.remove(favoriteEntry);

        return res.status(200).send({
          date: new Date(),
          status: true,
          data:
            'O usuário ' +
            req.body.user.id +
            ' desfavoritou o personagem ' +
            character_id
        });
      } else {
        //adiciona nos favoritos
        const user: User = await userRepository.findOne({
          where: {
            id: user_id
          }
        });

        if (!user) {
          return res.status(404).send({
            date: new Date(),
            status: false,
            data: 'Usuário não encontrado.'
          });
        }

        //find no personagem
        const character: Character = await characterRepository.findOne({
          where: {
            id: character_id
          }
        });

        if (!character) {
          return res.status(404).send({
            date: new Date(),
            status: false,
            data: 'Personagem não encontrado.'
          });
        }

        //cria nova entrada de favorito na tabela
        const favoriteEntry = new UserFavorites();
        favoriteEntry.user = user;
        favoriteEntry.character = character;

        await MysqlDataSource.manager.save(favoriteEntry);

        return res.status(200).send({
          date: new Date(),
          status: true,
          data:
            'O usuário ' +
            req.body.user.id +
            ' favoritou o personagem ' +
            character_id
        });
      }
    } catch (error) {
      return res.status(500).send({
        date: new Date(),
        status: false,
        data: 'Um erro interno ocorreu.'
      });
    }
  }
}
