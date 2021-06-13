import IORedis, { Redis } from 'ioredis';
import {
	Queue,
	Worker,
	QueueScheduler,
	QueueEvents,
	Processor,
	QueueOptions,
	WorkerOptions,
	QueueEventsOptions,
	QueueSchedulerOptions,
} from 'bullmq';
import config from './config';

interface WorkerOpt {
	queue?: Omit<QueueOptions, 'connection'>;
	worker?: Omit<WorkerOptions, 'connection'>;
	events?: Omit<QueueEventsOptions, 'connection'>;
	scheduler?: Omit<QueueSchedulerOptions, 'connection'>;
}

export class Workers {
	private redis?: Redis;

	private queueMap: Record<string, Queue> = {};
	private workerMap: Record<string, Worker> = {};
	private eventsMap: Record<string, QueueEvents> = {};
	private schedulerMap: Record<string, QueueScheduler> = {};

	private workerKeys: string[] = [];

	get connection() {
		if (!this.redis) {
			this.redis = new IORedis(config.workerRedisUrl, {
				connectionName: 'redis-worker',
			});
		}
		return this.redis;
	}

	create<T>(name: string, runner: Processor<T>, options?: WorkerOpt) {
		const key = this.getKey(name);

		this.workerKeys.push(key);

		this.queueMap[key] = new Queue<T>(key, {
			connection: this.connection,
			...options?.queue,
		});
		this.workerMap[key] = new Worker<T>(key, runner, {
			connection: this.connection,
			...options?.worker,
		});
		this.eventsMap[key] = new QueueEvents(key, {
			connection: this.connection,
			...options?.events,
		});
		this.schedulerMap[key] = new QueueScheduler(key, {
			connection: this.connection,
			...options?.scheduler,
		});
	}

	use<T>(name: string) {
		const res = this.findByName<T>(name);

		if (!res) {
			throw new Error('');
		}

		return {
			queue: res.queue,
			events: res.events,
		};
	}

	async delete(name: string) {
		const res = this.findByName(name);
		if (!res) return;

		const {key, index, queue, worker, events, scheduler} = res;

		queue.removeAllListeners();
		await queue.close();

		worker.removeAllListeners();
		await worker.close();

		events.removeAllListeners();
		await events.close();

		scheduler.removeAllListeners();
		await scheduler.close();

		delete this.queueMap[key];
		delete this.workerMap[key];
		delete this.eventsMap[key];
		delete this.schedulerMap[key];

		this.workerKeys.splice(index);
	}

	private getKey(name: string) {
		return name;
	}

	private findByName<T>(name: string) {
		const index = this.workerKeys.findIndex((el) => el === this.getKey(name));

		if (index < 0) {
			return null;
		}

		const key = this.workerKeys[index];

		return {
			key,
			index,
			queue: this.queueMap[key] as Queue<T>,
			worker: this.workerMap[key] as Worker<T>,
			events: this.eventsMap[key],
			scheduler: this.schedulerMap[key],
		};
	}
}

export const workers = new Workers();
