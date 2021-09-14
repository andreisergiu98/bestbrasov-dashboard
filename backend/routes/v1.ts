import Router from '@koa/router';
import { login, loginCallback } from '../modules/auth';

const router = new Router();

router.get('/auth/login', login);
router.get('/auth/callback', loginCallback);

export const routesV1 = router.routes();
