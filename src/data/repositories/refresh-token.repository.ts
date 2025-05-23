import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from './baseAbstract.repository';
import { RefreshToken } from '../schemas/refresh-token.schema';

export class RefreshTokenRepository extends BaseAbstractRepository<RefreshToken> {
	constructor(@InjectModel(RefreshToken.name) private readonly RefreshTokenModel: Model<RefreshToken>) {
		super(RefreshTokenModel);
	}
}
