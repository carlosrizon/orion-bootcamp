import { Router, Request, Response } from 'express';
import UserValidator from './validator/UserValidator';
import { UserController } from './controller/UserController';
import { AuthController } from './controller/AuthController';
import { authenticateToken } from './middleware/AuthMiddleware';
import { CharacterController } from './controller/CharacterController';
import { countCardClick } from './middleware/countCardClickMiddleware';
import SurveyController from './controller/SurveyController';
import SurveyValidator from './validator/SurveyValidator';
import { RecoveryController } from './controller/RecoveryController';
import { CommentController } from './controller/CommentController';
import { ArtistsController } from './controller/ArtistsController';
import { validateAmountPositiveInteger } from './validator/getShowcasePostersValidator';
import {
  validateCardDetailsParams,
  validateGetFavoritesPageParams,
  validateGetPageParams,
  validatePostFavoriteParams
} from './validator/characterEndpointsValidators';
import {
  validateDeleteComment,
  validateGetComment,
  validatePostComment
} from './validator/commentEndpointsValidators';
import { PaymentController } from './controller/PaymentController';
import Payments from './entity/Payment';
import QRCode from 'qrcode';
import { MysqlDataSource } from './config/database';

const router = Router();

//garantir apenas acesso autenticado à dashboard
router.all('/v1/dashboard', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

router.post('/v1/login', new AuthController().login);
router.post('/v1/qrcode/:id', async (req: Request, res: Response) => {
  const paymentRepository = MysqlDataSource.getRepository(Payments);
  const orderId = req.params.id;
  const order = await paymentRepository.findOneBy({
    paymentId: Number(orderId)
  });
  if (order) {
    const qrCodeDataUrl = await QRCode.toDataURL(order.qrcode);
    console.log(qrCodeDataUrl);
    return res.status(201).send({
      date: new Date(),
      status: true,
      data: { image: qrCodeDataUrl, qrcode: order.qrcode }
    });
  }

  return res.status(400).send({
    date: new Date(),
    status: false,
    data: 'Pedido não encontrado.'
  });
});

// endpoint para cadastro de novos usuários
router.post(
  '/v1/signup',
  new UserValidator().verify,
  new UserController().create
);

router.post(
  '/v1/paymentnotifications',
  new PaymentController().reciveNotificationPayment
);
router.post(
  '/v1/createpayment',
  authenticateToken,
  new PaymentController().createPayment
);

router.get('/v1/check', new AuthController().confirmRegistration);
router.post('/v1/recovery', new RecoveryController().validateUserEmail);
router.post('/v1/changepassword', new RecoveryController().changePassword);

router.get(
  '/v1/favorites',
  authenticateToken,
  validateGetFavoritesPageParams,
  new CharacterController().getFavoritesPage
);

router.post(
  '/v1/favorite',
  authenticateToken,
  validatePostFavoriteParams,
  new CharacterController().favoriteCharacter
);

router.get(
  '/v1/posters',
  authenticateToken,
  validateAmountPositiveInteger,
  new ArtistsController().getShowcasePosters
);

router.get(
  '/v1/:category',
  authenticateToken,
  validateGetPageParams,
  new CharacterController().getPage
);

router.post(
  '/v1/comments/:category/:categoryId',
  authenticateToken,
  validatePostComment,
  new CommentController().createComment
);

router.get(
  '/v1/comments/:category/:categoryId',
  authenticateToken,
  validateGetComment,
  new CommentController().getComments
);

router.delete(
  '/v1/comments/:comment_id',
  authenticateToken,
  validateDeleteComment,
  new CommentController().deleteComment
);

// endpoint para verificação de elegibilidade de usuário para pesquisa
router.get(
  '/v1/survey/user_eligibility',
  authenticateToken,
  new SurveyController().verifyEligibility
);

// endpoint para envio de dados para registro de pesquisa de satisfação do usuário
router.post(
  '/v1/survey/user_answer',
  authenticateToken,
  new SurveyValidator().verify,
  new SurveyController().create
);

router.get(
  '/v1/:category/:category_id',
  authenticateToken,
  validateCardDetailsParams,
  countCardClick,
  new CharacterController().getCardDetails
);

export default router;
