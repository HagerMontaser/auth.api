import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'AccessStrategy') {
	constructor(appConfig: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.config.jwt.accessTokenSecret,
			algorithms: ['HS512'],
			passReqToCallback: true
		} as StrategyOptionsWithRequest);
	}

	validate(req: Request, payload: unknown) {
		return payload;
	}
}
