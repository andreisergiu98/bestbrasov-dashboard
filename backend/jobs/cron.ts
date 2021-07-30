import { registerAuthSecretJobs } from './auth-secret';

export function registerCronJobs() {
	registerAuthSecretJobs();
}
