import ts from 'typescript';
import chalk from 'chalk';

const namespace = chalk.blue('[ types ]');

export function watchMain(tsconfigPath: string = 'tsconfig.json') {
	const configPath = ts.findConfigFile(
		/*searchPath*/ './',
		ts.sys.fileExists,
		tsconfigPath
	);
	if (!configPath) {
		throw new Error("Could not find a valid 'tsconfig.json'.");
	}

	// TypeScript can use several different program creation "strategies":
	//  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
	//  * ts.createSemanticDiagnosticsBuilderProgram
	//  * ts.createAbstractBuilder
	// The first two produce "builder programs". These use an incremental strategy
	// to only re-check and emit files whose contents may have changed, or whose
	// dependencies may have changes which may impact change the result of prior
	// type-check and emit.
	// The last uses an ordinary program which does a full type check after every
	// change.
	// Between `createEmitAndSemanticDiagnosticsBuilderProgram` and
	// `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
	// For pure type-checking scenarios, or when another tool/process handles emit,
	// using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
	const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

	// Note that there is another overload for `createWatchCompilerHost` that takes
	// a set of root files.
	const host = ts.createWatchCompilerHost(
		configPath,
		{},
		ts.sys,
		createProgram,
		createReportDiagnostic(ts.sys),
		reportWatchStatusChanged
	);

	// You can technically override any given hook on the host, though you probably
	// don't need to.
	// Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
	// doesn't use `this` at all.
	const origCreateProgram = host.createProgram;
	host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
		return origCreateProgram(rootNames, options, host, oldProgram);
	};
	const origPostProgramCreate = host.afterProgramCreate;

	host.afterProgramCreate = (program) => {
		origPostProgramCreate!(program);
	};

	// `createWatchProgram` creates an initial program, watches files, and updates
	// the program over time.
	ts.createWatchProgram(host);
}
function createReportDiagnostic(system) {
	const host = {
		getCanonicalFileName: (path) => path,
		getCurrentDirectory: () => system.getCurrentDirectory(),
		getNewLine: () => system.newLine,
	};
	const diagnostics = new Array(1);
	return (diagnostic) => {
		diagnostics[0] = diagnostic;
		console.log(namespace, ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
		diagnostics[0] = undefined;
	};
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
	if (diagnostic.code === 6031) {
		console.log(namespace, 'Checking types...');
		return;
	}
	if (diagnostic.code === 6032) {
		console.log(namespace, 'File change detected. Checking types...');
		return;
	}
	console.log(namespace, diagnostic.messageText);
}
