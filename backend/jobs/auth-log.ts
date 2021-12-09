import { AuthSession } from '@lib/models';
import { prisma } from '@lib/prisma';
import { workers } from '@lib/workers';

interface AuthWorkerPayload {
	sessionId: string;
}

const workerKey = 'auth-logger';

workers.create<AuthWorkerPayload, AuthSession, 'log-auth'>(workerKey, (job) => {
	return prisma.authSession.update({
		where: { id: job.data.sessionId },
		data: { lastTimeUsed: { set: new Date() } },
	});
});

export function useAuthLogWorker() {
	return workers.use<AuthWorkerPayload, AuthSession, 'log-auth'>(workerKey);
}

export async function logAuthUsage(sessionId: string) {
	const { queue } = useAuthLogWorker();
	queue.add('log-auth', { sessionId }, { delay: 5000, jobId: sessionId });
}
