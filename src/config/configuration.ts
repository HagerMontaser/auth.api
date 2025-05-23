import { registerAs } from '@nestjs/config';

export interface Config {
	Env: string;
	Database: {
		Host: string;
		Port: string;
		Name: string;
		authName: string;
		Password: string;
	};
}

export default registerAs('config', () => ({
	Env: process.env.APP_ENV,
	Database: {
		Host: process.env.DATABASE_HOST,
		Port: process.env.DATABASE_PORT,
		Name: process.env.DATABASE_NAME,
		authName: process.env.DATABASE_authNAME,
		Password: process.env.DATABASE_PASSWORD
	}
}));
