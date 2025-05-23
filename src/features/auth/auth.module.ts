import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataModule } from 'src/data/data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/data/schemas/user.schema';
import { UserRepository } from 'src/data/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/config/app-config.module';
import { AccessStrategy } from './strategies/jwt-access.strategy';
import { RefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository';
import { RefreshToken, RefreshTokenSchema } from 'src/data/schemas/refresh-token.schema';

@Module({
	imports: [
		DataModule,
		AppConfigModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: RefreshToken.name, schema: RefreshTokenSchema }
		])
	],
	controllers: [AuthController],
	providers: [UserRepository, RefreshTokenRepository, AuthService, AccessStrategy, RefreshStrategy],
	exports: []
})
export class AuthModule {}
