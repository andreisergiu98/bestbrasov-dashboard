import { workers } from '@lib/workers';
import { authSecret } from '../modules/auth-secret';

type WorkerPayload = null;

workers.create<WorkerPayload, void>('auth-secret', () => {
	return authSecret.removeInvalidSecrets();
});

export function useAuthSecretWorker() {
	return workers.use<WorkerPayload, void>('auth-secret');
}

export function registerAuthSecretJobs() {
	const { queue } = useAuthSecretWorker();

	queue.add('delete-invalid-secrets-cron', null, {
		// Repeat job once every day at 4:15 (am)
		repeat: { cron: '15 4 * * *' },
	});
}
