import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
@Injectable()
export class ExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}

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

		this.logger.error(
			`Exception thrown: ${JSON.stringify(normalizedMessage)} - Status: ${status}`,
			exception instanceof Error ? exception.stack : undefined,
			request.url
		);

		response.status(status).json({
			success: false,
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			...normalizedMessage
		});
	}
}
