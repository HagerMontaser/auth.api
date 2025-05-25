import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { Config } from 'src/config/configuration';

export const mongooseOptions: MongooseModuleAsyncOptions = {
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => {
		const config = configService.get<Config>('config');
		const { host, port, name, userName, password } = config?.dataBase ?? {};
		const uri =
			userName && password
				? `mongodb://${encodeURIComponent(userName)}:${encodeURIComponent(password)}@${host}:${port}/${name}?authSource=admin`
				: `mongodb://${host}:${port}/${name}`;
		return { uri, sanitizeFilter: true };
	},
	inject: [ConfigService]
};
