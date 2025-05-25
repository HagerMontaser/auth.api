import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();
		const now = Date.now();
		this.logger.log(`Incoming request: ${request.method} ${request.url}`, 'LoggingInterceptor');

		return next.handle().pipe(
			tap(() => {
				const duration = Date.now() - now;
				this.logger.log(`Handled ${request.method} ${request.url} in ${duration}ms`, 'LoggingInterceptor');
			})
		);
	}
}
