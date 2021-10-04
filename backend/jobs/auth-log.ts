import { prisma } from '@lib/prisma';
import { workers } from '@lib/workers';
import { Processor } from 'bullmq';

interface WorkerPayload {
	sessionId: string;
}

const runner: Processor<WorkerPayload> = async (job) => {
	return prisma.authSession.update({
		where: { id: job.data.sessionId },
		data: { lastTimeUsed: { set: new Date() } },
	});
};

workers.create<WorkerPayload>('auth-log', runner);

export const useAuthLogWorker = () => {
	return workers.use<WorkerPayload>('auth-log');
};

export const logAuthUsage = (sessionId: string) => {
	const { queue } = useAuthLogWorker();
	queue.add('log-usage', { sessionId }, { delay: 5000, jobId: sessionId });
};
