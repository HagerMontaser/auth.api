import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from './configuration';

@Injectable()
export class AppConfig {
	constructor(
		@Inject(configuration.KEY)
		public config: ConfigType<typeof configuration>
	) {}
}
