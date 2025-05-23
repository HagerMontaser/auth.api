import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/base/app.module';

describe('auth Registration (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/auths/register (POST) - should register a new auth', async () => {
		const authDto = {
			firstName: 'John',
			lastName: 'Doe',
			email: `john${Date.now()}@example.com`,
			password: 'password123',
			address: '123 Main St',
			country: 'USA',
			city: 'New York',
			phoneNumber: '+12345678901'
		};

		const response = await request(app.getHttpServer()).post('/auths/register').send(authDto).expect(201);

		expect(response.body).toHaveProperty('message', 'auth registered successfully');
		expect(response.body.auth).toMatchObject({
			Name: 'John Doe',
			email: authDto.email,
			address: authDto.address,
			country: authDto.country,
			city: authDto.city,
			phoneNumber: authDto.phoneNumber
		});
	});

	it('/auths/register (POST) - should not allow duplicate email', async () => {
		const authDto = {
			firstName: 'Jane',
			lastName: 'Smith',
			email: `jane${Date.now()}@example.com`,
			password: 'password123'
		};

		// First registration should succeed
		await request(app.getHttpServer()).post('/auths/register').send(authDto).expect(201);

		// Second registration with same email should fail
		const res = await request(app.getHttpServer()).post('/auths/register').send(authDto).expect(409);

		expect(res.body.message).toBe('Email already in use');
	});
});
