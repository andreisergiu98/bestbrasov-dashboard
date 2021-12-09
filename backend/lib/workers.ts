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

interface WorkerCollection<Payload, Result, JobName extends string> {
	queue: Queue<Payload, Result, JobName>;
	worker: Worker<Payload, Result, JobName>;
	events: QueueEvents;
	scheduler: QueueScheduler;
}

export class Workers {
	private redis?: Redis;

	private collectionMap = new Map<string, WorkerCollection<unknown, unknown, string>>();

	private logger = createLogger({
		name: 'workers',
	});

	create<Data = undefined, Result = void, JobName extends string = string>(
		name: string,
		runner: Processor<Data, Result, JobName>,
		options?: Options
	) {
		if (config.emitOnly) {
			this.logger.warn(`Emitting schema! Won't create worker '${name}'!`);
			return;
		}

		if (this.collectionMap.get(name)) {
			throw new Error(`Worker '${name}' already exists!`);
		}

		const queue = new Queue<Data, Result, JobName>(name, {
			connection: this.getConnection(),
			...options?.queue,
		});
		const worker = new Worker<Data, Result, JobName>(name, runner, {
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

		const collection = {
			queue,
			worker,
			events,
			scheduler,
		} as unknown as WorkerCollection<unknown, unknown, string>;

		this.collectionMap.set(name, collection);
	}

	use<T = undefined, R = void, JobName extends string = string>(name: string) {
		const collection = this.collectionMap.get(name);
		if (!collection) {
			throw new Error('No worker with name: ' + name);
		}
		return collection as unknown as WorkerCollection<T, R, JobName>;
	}

	async delete(name: string) {
		const collection = this.collectionMap.get(name);

		if (!collection) {
			return;
		}

		this.collectionMap.delete(name);

		collection.queue.removeAllListeners();
		collection.worker.removeAllListeners();
		collection.events.removeAllListeners();
		collection.scheduler.removeAllListeners();

		return Promise.all([
			collection.queue.close(),
			collection.worker.close(),
			collection.events.close(),
			collection.scheduler.close(),
		]).then(() => {
			// return void
		});
	}

	private createConnection() {
		return new IORedis(config.workers.db.url, {
			connectionName: config.workers.db.name,
			maxRetriesPerRequest: null,
			enableReadyCheck: false,
		});
	}

	private getConnection() {
		if (!this.redis) {
			this.redis = this.createConnection();
		}
		return this.redis;
	}
}

export const workers = new Workers();
