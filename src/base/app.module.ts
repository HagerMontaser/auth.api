import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
			cache: true // restart the app after changing Env variables 3
		})
	],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
