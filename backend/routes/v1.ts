import Router from '@koa/router';
import { login, loginCallback, logout } from '../modules/auth';

const router = new Router();

router.get('/auth/login', login);
router.get('/auth/logout', logout);
router.get('/auth/callback', loginCallback);

export const routesV1 = router.routes();
