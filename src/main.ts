import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './base/app.module';
import Constants from './config/constants';
import { EnvEnum } from './common/enums/environment.enum';
import { Config } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Add global validation pipe
	app.useGlobalPipes(new ValidationPipe());

	const configService = app.get(ConfigService);
	const config = configService.get<Config>('config');

	// Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Auth Api')
		.setDescription('The Auth Api documentation')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	if (config?.Env != EnvEnum.PROD) SwaggerModule.setup('api', app, document);

	// CORS
	app.enableCors({
		origin: '*'
	});

	await app.listen(Constants.SERVER_PORT, Constants.SERVER_HOST).then(async () => {
		const url = await app.getUrl();
		console.log(`ENV= ${config?.Env}`);
		console.log(`Server  running on ${url}`);
		console.log(`Swagger running on ${url}/api`);
	});
}
bootstrap();
