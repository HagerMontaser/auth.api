import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from './baseAbstract.repository';

export class UserRepository extends BaseAbstractRepository<User> {
	constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {
		super(UserModel);
	}
}
