import {
	Processor,
	Queue,
	QueueEvents,
	QueueEventsOptions,
	QueueOptions,
	QueueScheduler,
	QueueSchedulerOptions,
	Worker,
	WorkerOptions,
} from 'bullmq';
import IORedis, { Redis } from 'ioredis';
import config from './config';
import { createLogger } from './logger';

interface Options {
	queue?: Omit<QueueOptions, 'connection'>;
	worker?: Omit<WorkerOptions, 'connection'>;
	events?: Omit<QueueEventsOptions, 'connection'>;
	scheduler?: Omit<QueueSchedulerOptions, 'connection'>;
}

interface WorkerCollection<Payload, Result> {
	queue: Queue<Payload, Result, string>;
	worker: Worker<Payload, Result, string>;
	events: QueueEvents;
	scheduler: QueueScheduler;
}

type CollectionMap = Record<string, WorkerCollection<unknown, unknown> | undefined>;

export class Workers {
	private redis?: Redis;

	private collectionMap: CollectionMap = {};

	private logger = createLogger({
		name: 'workers',
	});

	create<T, R = unknown>(name: string, runner: Processor<T, R>, options?: Options) {
		if (config.emitOnly) {
			this.logger.warn(`Emitting schema! Won't create worker '${name}'!`);
			return;
		}

		if (this.collectionMap[name]) {
			throw new Error(`Worker '${name}' already exists!`);
		}

		const queue = new Queue<T, R, typeof name>(name, {
			connection: this.getConnection(),
			...options?.queue,
		});
		const worker = new Worker<T, R, typeof name>(name, runner, {
			connection: this.getConnection(),
			...options?.worker,
		});
		const events = new QueueEvents(name, {
			connection: this.getConnection(),
			...options?.events,
		});
		const scheduler = new QueueScheduler(name, {
			connection: this.getConnection(),
			...options?.scheduler,
		});

		this.collectionMap[name] = {
			queue,
			worker,
			events,
			scheduler,
		};
	}

	use<T, R = unknown>(name: string) {
		if (!this.collectionMap[name]) {
			throw new Error('No worker with name: ' + name);
		}
		return this.collectionMap[name] as WorkerCollection<T, R>;
	}

	async delete(name: string) {
		const collection = this.collectionMap[name];

		if (!collection) {
			return;
		}

		delete this.collectionMap[name];

		collection.queue.removeAllListeners();
		collection.worker.removeAllListeners();
		collection.events.removeAllListeners();
		collection.scheduler.removeAllListeners();

		return Promise.all([
			collection.queue.close(),
			collection.worker.close(),
			collection.events.close(),
			collection.scheduler.close(),
		]).then(() => {});
	}

	private getConnection() {
		if (!this.redis) {
			this.redis = new IORedis(config.workers.db.url, {
				connectionName: config.workers.db.name,
				maxRetriesPerRequest: null,
				enableReadyCheck: false,
			});
		}
		return this.redis;
	}
}

export const workers = new Workers();
