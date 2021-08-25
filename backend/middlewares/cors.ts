import koaCors from '@koa/cors';
import config from '@lib/config';

function verifyOrigin(origin?: string) {
	const allowedOrigins = config.cors.getAllowedOrigins();

	if (!origin) {
		return config.cors.defaultOrigin;
	}

	for (const allowedOrigin of allowedOrigins) {
		if (origin?.match(allowedOrigin)) {
			return origin;
		}
	}

	return config.cors.defaultOrigin;
}

export const cors = () => {
	return koaCors({
		credentials: true,
		origin: (ctx) => verifyOrigin(ctx.request.header.origin),
	});
};
