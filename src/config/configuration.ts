import { registerAs } from '@nestjs/config';

export interface Config {
	Env: string;
	Database: {
		Host: string;
	};
}

export default registerAs('config', () => ({
	Env: process.env.APP_ENV,
	Database: {
		Host: process.env.DATABASE_HOST
	}
}));
