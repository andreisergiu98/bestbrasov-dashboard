declare module 'process' {
	global {
		const process: {
			env: Record<string, string | undefined>;
		};
	}
}
