import { Router, Request, Response } from 'express';
import UserValidator from './validator/userValidator';
import { UserController } from './controller/UserController';
import { AuthController } from './controller/AuthController';
import { authenticateToken } from './middleware/AuthMiddleware';
import { CharacterController } from './controller/CharacterController';
import { countCardClick } from './middleware/countCardClickMiddleware';
import SurveyController from './controller/SurveyController';
import SurveyValidator from './validator/SurveyValidator';
import { RecoveryController } from './controller/RecoveryController';

const router = Router();

//garantir apenas acesso autenticado à dashboard
router.all('/v1/dashboard', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

router.post('/v1/login', new AuthController().login);

// endpoint para cadastro de novos usuários
router.post(
  '/v1/signup',
  new UserValidator().verify,
  new UserController().create
);

router.get('/v1/check', new AuthController().confirmRegistration);
router.post('/v1/recovery', new RecoveryController().validateUserEmail);
router.post('/v1/changepassword', new RecoveryController().changePassword);

//POST?
router.get(
  '/v1/favorites',
  authenticateToken,
  new CharacterController().getFavoritesPage
);

router.post(
  '/v1/favorite',
  authenticateToken,
  new CharacterController().favoriteCharacter
);

router.get(
  '/v1/:category',
  authenticateToken,
  new CharacterController().getPage
);

// endpoint para verificação de elegibilidade de usuário para pesquisa
router.get(
  '/v1/survey/user_eligibility',
  authenticateToken,
  new SurveyValidator().verifyEligibility,
  new SurveyController().eligible
);

// endpoint para envio de dados para registro de pesquisa de satisfação do usuário
router.post(
  '/v1/survey/user_answer',
  authenticateToken,
  new SurveyValidator().verifyEligibility,
  new SurveyValidator().verifyAnswer,
  new SurveyController().create
);

router.get(
  '/v1/:category/:category_id',
  authenticateToken,
  countCardClick,
  new CharacterController().getCardDetails
);

export default router;
