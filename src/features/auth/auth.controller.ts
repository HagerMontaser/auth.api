import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto, LoginDto, TokenDto, TokenResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AccessGuard } from './guards/jwt-auth.guard';
import { RefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Register a new auth' })
	@ApiResponse({
		status: 201,
		description: 'auth registered successfully',
		schema: {
			example: {
				message: 'auth registered successfully',
				auth: {
					firstName: 'Alice',
					lastName: 'Smith',
					email: 'alice.smith@example.com',
					address: '456 Elm St',
					country: 'Canada',
					city: 'Toronto',
					phoneNumber: '+19876543210'
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
					firstName: 'Alice',
					lastName: 'Smith',
					email: 'alice.smith@example.com',
					password: 'P@ssw0rd!'
				}
			},
			full: {
				summary: 'Full registration with all fields',
				value: {
					firstName: 'Alice',
					lastName: 'Smith',
					email: 'alice.smith@example.com',
					password: 'P@ssw0rd!',
					address: '456 Elm St',
					country: 'Canada',
					city: 'Toronto',
					phoneNumber: '+19876543210'
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
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiResponse({
		status: 200,
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
					email: 'alice.smith@example.com',
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

	@Post('refresh')
	@UseGuards(RefreshGuard)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({
		status: 200,
		description: 'Access token refreshed successfully',
		type: TokenResponseDto,
		schema: {
			example: {
				accessToken: 'e...',
				refreshToken: 'e...'
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid or expired refresh token'
	})
	@ApiBody({
		type: TokenDto,
		description: 'Refresh token data',
		examples: {
			default: {
				summary: 'Refresh example',
				value: {
					jti: 'some-jti',
					refreshToken: 'e...'
				}
			}
		}
	})
	async refresh(@Body() TokenDto: TokenDto) {
		return this.authService.refreshAccessToken(TokenDto.refreshToken, TokenDto.jti);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Logout and revoke refresh token' })
	@ApiResponse({
		status: 200,
		description: 'Logout successful, refresh token revoked'
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - No or invalid refresh token'
	})
	async logout(@Body() TokenDto: TokenDto) {
		return this.authService.logout(TokenDto.refreshToken, TokenDto.jti);
	}

	@Get('protected')
	@UseGuards(AccessGuard)
	protected() {
		return { message: 'Welcome to the application.' };
	}
}
