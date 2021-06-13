import 'reflect-metadata';
import { addAliases } from 'module-alias';

addAliases({
	'@generated': __dirname + '/__generated__',
	'@lib': __dirname + '/lib',
});
