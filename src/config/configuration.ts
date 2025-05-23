import { registerAs } from '@nestjs/config';

export interface Config {
	env: string;
	server: {
		host: string;
		port: string;
	};
	dataBase: {
		host: string;
		port: string;
		name: string;
		userName: string;
		password: string;
	};
	jwt: {
		accessTokenSecret: string;
		accessTokenExpiration: string;
		refreshTokenSecret: string;
		refreshTokenExpiration: string;
	};
}

export default registerAs<Config>('config', () => ({
	env: process.env.APP_ENV!,
	server: {
		host: process.env.SERVER_HOST!,
		port: process.env.SERVER_PORT!
	},
	dataBase: {
		host: process.env.DATABASE_HOST!,
		port: process.env.DATABASE_PORT!,
		name: process.env.DATABASE_NAME!,
		userName: process.env.DATABASE_USERNAME!,
		password: process.env.DATABASE_PASSWORD!
	},
	jwt: {
		accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
		accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '15m',
		refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
		refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME ?? '7d'
	}
}));
