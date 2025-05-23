import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

		// Normalize the message format
		let normalizedMessage: object;
		if (typeof message === 'string') {
			normalizedMessage = { message };
		} else if (typeof message === 'object') {
			normalizedMessage = message;
		} else {
			normalizedMessage = { message: 'Unexpected error occurred' };
		}

		response.status(status).json({
			success: false,
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			...normalizedMessage
		});
	}
}
