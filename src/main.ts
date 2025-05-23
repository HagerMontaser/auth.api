import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './base/app.module';
import { EnvEnum } from './common/enums/environment.enum';
import { Config } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Add global exception filter
	app.useGlobalFilters(new ExceptionsFilter());

	// Add global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, //	Strip unknown properties
			transform: true //Convert inputs to expected DTO types
		})
	);

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

	// process.on('unhandledRejection', (error: any) => {
	//token?.split('.')?.at(-1)
	// 	loggingService.Exceptions(error?.stack, CommonHelper.getErrorMessage(error));
	// });
	// process.on('uncaughtException', (error: any) => {
	// 	loggingService.Exceptions(error?.stack, CommonHelper.getErrorMessage(error));
	// });

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
