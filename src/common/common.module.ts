import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from './filters/exception.filter';
import { LoggingInterceptor } from './interceptors/Logging.Interceptor';
import { LoggerService } from './logger/logger.service';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: ExceptionsFilter
		},
		LoggerService
	],
	exports: [LoggerService]
})
export class CommonModule {}
