import views from 'koa-views';
import path from 'path';

export function renderer() {
	return views(path.join(__dirname, '/../views'), {
		extension: 'ejs',
	});
}
