import 'reflect-metadata';
import { addAliases } from 'module-alias';

addAliases({
	'@lib': __dirname + '/lib',
});
