import { workers } from '@lib/workers';
import { authSecret } from '../modules/auth-secret';

type WorkerPayload = null;

workers.create<WorkerPayload>('auth-secret', async () => {
	await authSecret.removeInvalidSecrets();
});

export const useAuthSecretWorker = () => {
	return workers.use<WorkerPayload>('auth-secret');
};

export const registerAuthSecretJobs = () => {
	const { queue } = useAuthSecretWorker();

	queue.add('delete-invalid-secrets-cron', null, {
		// Repeat job once every day at 4:15 (am)
		repeat: { cron: '15 4 * * *' },
	});
};
