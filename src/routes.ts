import { Router } from 'express';
import { UsersController } from './controller/UsersController';
import { HomeValidator } from './validator/Home.validator';

const router = Router();

router.post('/users', new HomeValidator().post, new UsersController().create);

export default router;
