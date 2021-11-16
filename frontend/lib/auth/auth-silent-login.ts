import config from '../config';

interface IframeResult {
	ok: boolean;
	type: string;
}

type MessageListener = (e: MessageEvent<undefined | IframeResult>) => void;

type MessageReject = (message: string) => void;
type MessageResolve = () => void;

export class AuthSilent {
	loggingIn = false;
	private loggedInOk = false;
	private readonly messageType = 'SILENT_LOGIN';

	async login() {
		if (this.loggingIn) {
			await this.waitForUnlock();

			if (!this.loggedInOk) {
				throw new Error("Couldn't login in!");
			}

			return;
		}

		return this.trySilentLogin();
	}

	private async trySilentLogin() {
		this.setLock();

		const iframe = this.createIframe();

		let listener: MessageListener = () => {
			// empty function for initialization
			// overridden by result
		};

		const resolver = new Promise<void>((resolve, reject) => {
			listener = this.createListener(resolve, reject);
			this.bindListener(listener);
			document.body.append(iframe);
		});

		try {
			await resolver;
			iframe.remove();
			this.removeLock(true);
			this.removeListener(listener);
		} catch (e) {
			iframe.remove();
			this.removeLock(false);
			this.removeListener(listener);
			throw e;
		}
	}

	private createIframe() {
		const iframe = document.createElement('iframe');
		iframe.id = 'silent-sign-in';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.position = 'absolute';
		iframe.style.visibility = 'hidden';
		iframe.src = config.api.authSilentLoginUrl;
		return iframe;
	}

	private createListener(
		resolve: MessageResolve,
		reject: MessageReject
	): MessageListener {
		const timeoutId = setTimeout(() => {
			reject('Silent login timed out!');
		}, 10000);

		return (e) => {
			if (e.data?.type !== this.messageType) {
				return;
			}

			clearTimeout(timeoutId);

			if (e.data.ok) {
				resolve();
			} else {
				reject("Couldn't login in!");
			}
		};
	}

	private bindListener(listener: MessageListener) {
		window.addEventListener('message', listener);
	}

	private removeListener(listener: MessageListener) {
		window.removeEventListener('message', listener);
	}

	private setLock() {
		this.loggingIn = true;
	}

	private removeLock(result: boolean) {
		this.loggingIn = false;
		this.loggedInOk = result;
	}

	private waitForUnlock() {
		return new Promise<void>((resolve) => {
			const intervalId = setInterval(() => {
				if (!this.loggingIn) {
					clearInterval(intervalId);
					resolve();
				}
			}, 50);
		});
	}
}
