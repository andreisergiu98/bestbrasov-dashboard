import config from '../config';

type MessageListener = (e: MessageEvent) => void;

type MessageReject = (message: string) => void;
type MessageResolve = (value: boolean) => void;

export class AuthRefresh {
	refreshing = false;
	private refreshedOk = false;
	private readonly messageType = 'SILENT_REFRESH';

	async refresh() {
		if (this.refreshing) {
			await this.waitForUnlock();
			if (!this.refreshedOk) {
				throw new Error("Couldn't refresh token!");
			}
			return;
		}

		this.refreshing = true;
		const { iframe, listener, getResult } = this.createRefresher();

		let refreshed;

		try {
			refreshed = await getResult();
		} catch (e) {
			iframe.remove();
			this.removeLock(false);
			this.removeListener(listener);
			throw e;
		}

		iframe.remove();
		this.removeLock(refreshed);
		this.removeListener(listener);

		if (!refreshed) {
			throw new Error("Couldn't refresh token!");
		}
	}

	private removeLock(result: boolean) {
		this.refreshing = false;
		this.refreshedOk = result;
	}

	private async waitForUnlock() {
		return new Promise<void>((resolve) => {
			const intervalId = setInterval(() => {
				if (!this.refreshing) {
					clearInterval(intervalId);
					resolve();
				}
			}, 50);
		});
	}

	private createRefresher() {
		const iframe = this.createIframe();
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let listener: (e: MessageEvent) => void = () => {};

		const result = new Promise<boolean>((resolve, reject) => {
			listener = this.createListener(resolve, reject);
			this.bindListener(listener);
			document.body.append(iframe);
		});

		return {
			iframe,
			listener,
			getResult: async () => result,
		};
	}

	private createIframe() {
		const iframe = document.createElement('iframe');
		iframe.id = 'silent-refresh';
		iframe.setAttribute('src', config.api.authRefreshUrl);
		iframe.style.width = '1px';
		iframe.style.height = '1px';
		iframe.style.position = 'absolute';
		iframe.style.top = '-99999px';
		return iframe;
	}

	private createListener(resolve: MessageResolve, reject: MessageReject) {
		const timeoutId = setTimeout(() => {
			reject('Silent refresh timed out!');
		}, 10000);

		return (e: MessageEvent) => {
			const { type, ok } = e.data;
			if (type !== this.messageType) return;

			clearTimeout(timeoutId);
			resolve(ok);
		};
	}

	private bindListener(listener: MessageListener) {
		window.addEventListener('message', listener);
	}

	private removeListener(listener: MessageListener) {
		window.removeEventListener('message', listener);
	}
}
