export function resizeGooglePicture(src: string, width: number, height?: number) {
	if (!src.startsWith('https://lh3.googleusercontent.com')) {
		return src;
	}

	let url = src;

	const indexOfEq = src.lastIndexOf('=');
	if (indexOfEq > 0) {
		url = src.substring(0, indexOfEq);
	}

	url += `=w${width}`;
	if (height) {
		url += `-h${height}-p`;
	}

	return url;
}
