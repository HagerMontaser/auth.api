import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor() {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// const request = context.switchToHttp().getRequest<Request>();

		return next.handle().pipe(tap(() => {}));
	}
}
