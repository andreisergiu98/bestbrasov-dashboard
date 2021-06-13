import Router from '@koa/router';
import { login, loginCallback, silentLoginCallback } from '../modules/auth';

const router = new Router();

router.get('/auth/login', login);
router.get('/auth/callback', loginCallback);
router.get('/auth/silent-callback', silentLoginCallback);

export const routesV1 = router.routes();
