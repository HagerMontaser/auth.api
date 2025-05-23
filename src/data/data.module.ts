import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const config = configService.get<Config>('config');
				const { host, port, name, userName, password } = config?.dataBase ?? {};
				const uri =
					userName && password
						? `mongodb://${encodeURIComponent(userName)}:${encodeURIComponent(password)}@${host}:${port}/${name}?authSource=admin`
						: `mongodb://${host}:${port}/${name}`;
				return { uri };
			},
			inject: [ConfigService]
		})
	],
	exports: [MongooseModule]
})
export class DataModule {}
