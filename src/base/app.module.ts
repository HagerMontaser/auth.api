import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { DataModule } from 'src/data/data.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CoursesModule } from 'src/features/courses/courses.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { CommonModule } from 'src/common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
			cache: true // restart the app after changing Env variables 3
		}),
		JwtModule.register({ global: true }),
		DataModule,
		TasksModule,
		AuthModule,
		CoursesModule,
		CommonModule
	],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
