import { Body, Request, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto, LoginDto, RefreshDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AccessGuard } from './guards/jwt-auth.guard';
import { RefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@ApiBearerAuth()
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
		type: RegisterUserDto,
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
	async register(@Body() createUserDto: RegisterUserDto) {
		await this.authService.register(createUserDto);
		return {
			message: 'User registered successfully'
		};
	}

	@Post('login')
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiResponse({
		status: 201,
		description: 'Login successful, returns access and refresh tokens',
		schema: {
			example: {
				accessToken: '...',
				refreshToken: '...'
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid credentials'
	})
	@ApiBody({
		type: LoginDto,
		description: 'User login credentials',
		examples: {
			default: {
				summary: 'Login example',
				value: {
					email: 'john.doe@example.com',
					password: 'password123'
				}
			}
		}
	})
	async login(@Body() loginDto: LoginDto) {
		const user = await this.authService.validateUser(loginDto.email, loginDto.password);
		if (!user) {
			throw new UnauthorizedException('Invalid username or password');
		}
		return this.authService.generateTokens(user.Id, user.email);
	}

	@UseGuards(RefreshGuard)
	@Post('refresh')
	async refresh(@Body() refreshDto: RefreshDto) {
		return this.authService.refreshAccessToken(refreshDto.refreshToken, refreshDto.jti);
	}

	@Post('logout')
	@UseGuards(RefreshGuard)
	async logout(@Request() req: Request) {
		const refreshToken = req.headers['authorization']?.split(' ')[1];
		return this.authService.logout(refreshToken);
	}

	@UseGuards(AccessGuard)
	@Get('protected')
	async protected() {
		return { message: 'Welcome to the application.' };
	}
}
