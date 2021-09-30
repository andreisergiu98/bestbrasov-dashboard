import crypto from 'crypto';

export async function generateRandomBytes(size: number, encoding?: BufferEncoding) {
	return new Promise<string>((resolve, reject) => {
		crypto.randomBytes(size, (err, buff) => {
			if (err) {
				reject(err);
			} else {
				resolve(buff.toString(encoding));
			}
		});
	});
}
