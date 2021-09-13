const fs = require('fs/promises');
const { join } = require('path');

module.exports.copyStaticFiles = ({ files, outdir }) => ({
	name: 'copy-static-files',
	async setup(build) {
		const dir = outdir || build.initialOptions.outdir;

		build.onStart(async () => {
			try {
				await fs.mkdir(dir, { recursive: true });
			} catch (e) {}
			await Promise.all(files.map((file) => fs.copyFile(file, join(dir, file))));
		});
	},
});
