import { AuthSession } from '@lib/models';
import { prisma } from '@lib/prisma';
import { workers } from '@lib/workers';

interface WorkerPayload {
	sessionId: string;
}

workers.create<WorkerPayload, AuthSession>('auth-log', (job) => {
	return prisma.authSession.update({
		where: { id: job.data.sessionId },
		data: { lastTimeUsed: { set: new Date() } },
	});
});

export function useAuthLogWorker() {
	return workers.use<WorkerPayload, AuthSession>('auth-log');
}

export async function logAuthUsage(sessionId: string) {
	const { queue } = useAuthLogWorker();
	queue.add('log-usage', { sessionId }, { delay: 5000, jobId: sessionId });
}
