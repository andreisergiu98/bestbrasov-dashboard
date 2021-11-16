import favicon from 'koa-favicon';
import mount from 'koa-mount';
import serve from 'koa-static';
import path from 'path';

export function servePublic() {
	return mount('/public', serve(path.join(__dirname, '/../public')));
}

export function serveFavicon() {
	return favicon(__dirname + '/../public/favicon.ico');
}
