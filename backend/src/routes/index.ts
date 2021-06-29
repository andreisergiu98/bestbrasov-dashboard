import Router from '@koa/router';
import { routesV1 } from './v1';

const router = new Router();
router.use('/v1', routesV1);

export const routes = router.routes();
