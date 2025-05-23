import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto, User } from './auth.dto';
import { UserRepository } from 'src/data/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async register(createUserDto: CreateUserDto): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			email: createUserDto.email
		});
		if (existingUser) {
			throw new ConflictException('Email already in use');
		}

		const hash = await bcrypt.hash(createUserDto.password, 10);

		const auth = await this.userRepository.create({
			...createUserDto,
			password: hash
		});

		return {
			Name: `${auth.firstName} ${auth.lastName}`,
			email: auth.email,
			address: auth.address,
			city: auth.city,
			country: auth.country,
			phoneNumber: auth.phoneNumber
		};
	}
}
