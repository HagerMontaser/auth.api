/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './base/app.module';
import { EnvEnum } from './common/enums/environment.enum';
import { Config } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Add global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, //	Strip unknown properties
			transform: true //Convert inputs to expected DTO types
		})
	);

	app.use(helmet()); // Sets various HTTP headers to secure the app from common vulnerabilities

	const configService = app.get(ConfigService);
	const config = configService.get<Config>('config');

	// Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Auth Api')
		.setDescription('The Auth Api documentation')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	if (config?.env != EnvEnum.PROD) SwaggerModule.setup('api', app, document);

	// CORS
	app.enableCors({
		origin: '*'
	});

	const logger = app.get(LoggerService);
	process.on('unhandledRejection', (reason: any) => {
		const message = reason instanceof Error ? reason.message : JSON.stringify(reason);
		const stack = reason instanceof Error ? reason.stack : undefined;
		logger.error(`Unhandled Rejection: ${message}`, stack, 'UnhandledRejection');
	});

	process.on('uncaughtException', (error: Error) => {
		logger.error(`Uncaught Exception: ${error.message}`, error.stack, 'UncaughtException');
		process.exit(1);
	});

	await app.listen(config?.server.port ?? 3000, config?.server.host ?? '127.0.0.1').then(async () => {
		const url = await app.getUrl();
		console.log(`ENV= ${config?.env}`);
		console.log(`Server  running on ${url}`);
		console.log(`Swagger running on ${url}/api`);
	});
}

bootstrap().catch((err) => {
	console.error('Error during bootstrap:', err);
	process.exit(1);
});
