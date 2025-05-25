import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

@Injectable()
export class LoggerService {
	private readonly logger: WinstonLogger;

	constructor() {
		this.logger = createLogger({
			level: 'info',
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.printf((info: { timestamp: string; level: string; message: string; context?: string }) => {
					const { timestamp, level, message, context } = info;
					return `${timestamp} [${level.toUpperCase()}] ${context ? '[' + context + '] ' : ''}${message}`;
				})
			),
			transports: [
				new transports.File({ filename: 'logs/error.log', level: 'error' }),
				new transports.File({
					filename: 'logs/log.log',
					level: 'info',
					format: format.combine(this.excludeErrorsFilter())
				})
			]
		});
	}

	log(message: string, context?: string) {
		this.logger.info({ message, context });
	}

	error(message: string, trace?: string, context?: string) {
		this.logger.error({ message: `${message} - ${trace}`, context });
	}

	excludeErrorsFilter = format((info) => {
		return info.level === 'error' ? false : info;
	});
}
