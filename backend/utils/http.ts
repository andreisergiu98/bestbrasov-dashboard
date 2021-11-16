import { Logger } from '@lib/logger';
import http from 'http';

export function startHttpServer(server: http.Server, port: number, logger?: Logger) {
	const promise = new Promise<http.Server>((resolve, reject) => {
		server.on('listening', () => {
			logger?.info(`Server is running on port ${port}`);
			resolve(server);
		});

		server.on('error', (err: Error & { code?: string }) => {
			if (err.code === 'EADDRINUSE') {
				logger?.error(`Port ${port} is already in use!`);
			} else {
				logger?.error(err);
			}
			reject(err);
		});
	});

	server.listen(port);

	return promise;
}
