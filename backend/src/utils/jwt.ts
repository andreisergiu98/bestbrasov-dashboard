import {
	sign,
	verify,
	decode,
	GetPublicKeyOrSecret,
	Secret,
	SignOptions,
	VerifyOptions,
} from 'jsonwebtoken';

export async function jwtSign(
	// eslint-disable-next-line @typescript-eslint/ban-types
	payload: string | object | Buffer,
	secret: Secret,
	options: SignOptions = {}
) {
	return new Promise<string>((resolve, reject) => {
		sign(payload, secret, options, (err, token) => {
			if (err) return reject(err);
			resolve(token as string);
		});
	});
}

export async function jwtVerify<T = unknown | undefined>(
	token: string,
	secretOrPublicKey: Secret | GetPublicKeyOrSecret,
	options?: VerifyOptions
) {
	return new Promise<T>((resolve, reject) => {
		verify(token, secretOrPublicKey, options, (err, payload) => {
			if (err) return reject(err);
			resolve(payload as unknown as T);
		});
	});
}

export { decode as jwtDecode };
