import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto, TokenResponseDto, User } from './auth.dto';
import { UserRepository } from 'src/data/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/config/app.config';
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { parseTimeToMilliseconds } from 'src/common/utils/time.util';
import { hashToken } from 'src/common/utils/hash.util';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly refreshTokenRepository: RefreshTokenRepository,
		private readonly jwtService: JwtService,
		private readonly appConfig: AppConfig
	) {}

	async register(createUserDto: RegisterUserDto): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			email: createUserDto.email
		});
		if (existingUser) {
			throw new ConflictException('Invalid email!');
		}

		const hash = await bcrypt.hash(createUserDto.password, 12);
		const user = await this.userRepository.create({
			...createUserDto,
			password: hash
		});

		return {
			Name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			address: user.address,
			city: user.city,
			country: user.country,
			phoneNumber: user.phoneNumber
		} as User;
	}

	async validateUser(email: string, pass: string): Promise<User | null> {
		const user = await this.userRepository.findOneAndIncludePass({ email });
		if (user && (await bcrypt.compare(pass, user.password))) {
			return {
				Id: user._id.toString(),
				Name: `${user.firstName} ${user.lastName}`,
				email: user.email,
				address: user.address,
				city: user.city,
				country: user.country,
				phoneNumber: user.phoneNumber
			} as User;
		}
		return null;
	}

	async refreshAccessToken(refreshToken: string, jti: string): Promise<TokenResponseDto> {
		const refreshHashed = hashToken(refreshToken, this.appConfig.config.jwt.refreshTokenSecret);

		// Validate the refresh token
		const storedToken = await this.refreshTokenRepository.findOne({
			refreshToken: refreshHashed,
			jti: jti,
			isRevoked: false,
			expiresAt: { $gt: new Date() }
		});

		if (!storedToken) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		// Validate the user exists
		const user = await this.userRepository.findOne({
			_id: storedToken.userId
		});
		if (!user) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		// Revoke the old token (use refresh token only one time for implementing refresh token rotation strategy)
		await this.refreshTokenRepository.updateOne({ _id: storedToken._id }, { isRevoked: true });

		return this.generateTokens(user._id.toString(), user.email);
	}

	async generateTokens(userId: string, email: string): Promise<TokenResponseDto> {
		// Binding Refresh Tokens to Access Tokens (Token Pairing)
		const jti = randomUUID();
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{ sub: userId, email: email, jti },
				{
					secret: this.appConfig.config.jwt.accessTokenSecret,
					expiresIn: this.appConfig.config.jwt.accessTokenExpiration,
					algorithm: 'HS512'
				}
			),
			this.jwtService.signAsync(
				{ sub: userId, email: email },
				{
					secret: this.appConfig.config.jwt.refreshTokenSecret,
					expiresIn: this.appConfig.config.jwt.refreshTokenExpiration,
					algorithm: 'HS512'
				}
			)
		]);

		// Hash the refresh token with access token identifier before storing it
		const refreshHashed = hashToken(refreshToken, this.appConfig.config.jwt.refreshTokenSecret);
		const expiresInMs = parseTimeToMilliseconds(this.appConfig.config.jwt.refreshTokenExpiration);
		await this.refreshTokenRepository.create({
			userId: new Types.ObjectId(userId),
			jti: jti,
			refreshToken: refreshHashed,
			expiresAt: new Date(Date.now() + expiresInMs)
		});

		return { accessToken, refreshToken };
	}

	async logout(refreshToken: string, jti: string): Promise<{ success: boolean }> {
		const refreshHashed = hashToken(refreshToken, this.appConfig.config.jwt.refreshTokenSecret);
		const isSuccess = await this.refreshTokenRepository.updateOne(
			{ refreshToken: refreshHashed, jti },
			{ isRevoked: true }
		);
		return { success: isSuccess };
	}
}
