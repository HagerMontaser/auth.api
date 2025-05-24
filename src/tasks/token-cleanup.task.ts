import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository';

@Injectable()
export class TokenCleanupTask {
	constructor(private readonly tokenRepository: RefreshTokenRepository) {}

	@Cron('0 3 * * *') // Daily at 3 AM
	async handleExpiredTokens() {
		await this.tokenRepository.deleteMany({
			expiresAt: { $lt: new Date() }
		});
	}
}
