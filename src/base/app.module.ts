import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { DataModule } from 'src/data/data.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
			cache: true // restart the app after changing Env variables 3
		}),
		JwtModule.register({ global: true }),
		DataModule,
		AuthModule
	],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
