import { Router } from 'express';
import * as express from 'express';
import { login, register } from '../controllers/authController';

const router: express.Router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;
