import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupTask } from './token-cleanup.task';
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from 'src/data/schemas/refresh-token.schema';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }])
	],
	providers: [RefreshTokenRepository, TokenCleanupTask]
})
export class TasksModule {}
