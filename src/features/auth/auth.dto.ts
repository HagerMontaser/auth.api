import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({
		description: 'auth first name',
		example: 'John'
	})
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({
		description: 'auth last name',
		example: 'Doe'
	})
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		description: 'auth email address',
		example: 'john.doe@example.com'
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'auth password (min 6 characters)',
		example: 'password123',
		minLength: 6
	})
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@ApiPropertyOptional({
		description: 'auth physical address',
		example: '123 Main St',
		required: false
	})
	address?: string;

	@ApiPropertyOptional({
		description: 'auth country',
		example: 'USA',
		required: false
	})
	country?: string;

	@ApiPropertyOptional({
		description: 'auth city',
		example: 'New York',
		required: false
	})
	city?: string;

	@ApiPropertyOptional({
		description: 'auth phone number',
		example: '+1234567890',
		required: false
	})
	phoneNumber?: string;
}

export class User {
	@ApiProperty()
	Name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	address: string;

	@ApiProperty()
	country: string;

	@ApiProperty()
	city: string;

	@ApiProperty()
	phoneNumber: string;
}
