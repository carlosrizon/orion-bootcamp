import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { HomeValidator } from './validator/Home.validator';

const router = Router();

router.get('/', new HomeValidator().post, new HomeController().hello);

export default router;
