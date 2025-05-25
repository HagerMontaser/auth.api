import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'RefreshStrategy') {
	constructor(appConfig: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.config.jwt.refreshTokenSecret,
			algorithms: ['HS512'],
			passReqToCallback: true
		} as StrategyOptionsWithRequest);
	}

	validate(req: Request, payload: unknown) {
		return payload;
	}
}
