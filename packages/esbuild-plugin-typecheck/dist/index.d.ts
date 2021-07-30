export declare type EsbuildTypeCheckOptions = {
	tsconfigPath?: string;
};
export declare function esbuildTypechecking(options: EsbuildTypeCheckOptions): {
	name: string;
	setup(): void;
};
export default esbuildTypechecking;
