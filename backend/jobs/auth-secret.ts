import { workers } from '@lib/workers';
import { authSecret } from '../modules/auth-secret';

const workerKey = 'auth-secret';

workers.create<null, void, 'delete-invalid-secrets'>(workerKey, () => {
	return authSecret.removeInvalidSecrets();
});

export function useAuthSecretWorker() {
	return workers.use<null, void, 'delete-invalid-secrets'>(workerKey);
}

export function registerAuthSecretJobs() {
	const { queue } = useAuthSecretWorker();

	queue.add('delete-invalid-secrets', null, {
		// Repeat job once every day at 4:15 (am)
		repeat: { cron: '15 4 * * *' },
	});
}
