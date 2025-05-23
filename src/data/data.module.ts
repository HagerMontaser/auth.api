import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const config = configService.get<Config>('config');
				const { Host, Port, Name, authName, Password } = config?.Database ?? {};
				const uri =
					authName && Password
						? `mongodb://${encodeURIComponent(authName)}:${encodeURIComponent(Password)}@${Host}:${Port}/${Name}?authSource=admin`
						: `mongodb://${Host}:${Port}/${Name}`;
				return { uri };
			},
			inject: [ConfigService]
		})
	],
	exports: [MongooseModule]
})
export class DataModule {}
