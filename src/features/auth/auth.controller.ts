import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'Register a new auth' })
	@ApiResponse({
		status: 201,
		description: 'auth registered successfully',
		schema: {
			example: {
				message: 'auth registered successfully',
				auth: {
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					address: '123 Main St',
					country: 'USA',
					city: 'New York',
					phoneNumber: '+1234567890'
				}
			}
		}
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid input data'
	})
	@ApiResponse({
		status: 409,
		description: 'Conflict - Email already exists'
	})
	@ApiBody({
		type: CreateUserDto,
		description: 'auth registration data',
		examples: {
			basic: {
				summary: 'Basic registration',
				value: {
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password123'
				}
			},
			full: {
				summary: 'Full registration with all fields',
				value: {
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password123',
					address: '123 Main St',
					country: 'USA',
					city: 'New York',
					phoneNumber: '+1234567890'
				}
			}
		}
	})
	async register(@Body() createUserDto: CreateUserDto) {
		const auth = await this.authService.register(createUserDto);
		return {
			message: 'User registered successfully',
			auth
		};
	}
}
