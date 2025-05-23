import { IsNotEmpty, IsEmail, MinLength, Matches, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class RegisterUserDto {
	@ApiProperty({
		description: 'user first name',
		example: 'Alice',
		minLength: 3
	})
	@IsNotEmpty()
	@MinLength(3, { message: 'First name must be at least 3 characters long' })
	firstName: string;

	@ApiProperty({
		description: 'user last name',
		example: 'Smith',
		minLength: 3
	})
	@IsNotEmpty()
	@MinLength(3, { message: 'Last name must be at least 3 characters long' })
	lastName: string;

	@ApiProperty({
		description: 'user email address',
		example: 'alice.smith@example.com'
	})
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string;

	@ApiProperty({
		description: 'user password',
		example: 'P@ssw0rd!',
		minLength: 8
	})
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^+=\-_])[A-Za-z\d@$!%*#?&^+=\-_]{8,}$/, {
		message: 'Password must contain at least one letter, one number, and one special character'
	})
	password: string;

	@ApiPropertyOptional({
		description: 'user physical address',
		example: '456 Elm St'
	})
	@IsOptional()
	address?: string;

	@ApiPropertyOptional({
		description: 'user country',
		example: 'Canada'
	})
	@IsOptional()
	country?: string;

	@ApiPropertyOptional({
		description: 'user city',
		example: 'Toronto'
	})
	@IsOptional()
	city?: string;

	@ApiPropertyOptional({
		description: 'user phone number',
		example: '+19876543210'
	})
	@IsOptional()
	@Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
	@Matches(/^\+\d{10,15}$/, {
		message: 'Phone number must be a valid international number (e.g., +1234567890)'
	})
	phoneNumber?: string;
}

export class LoginDto {
	@ApiProperty({
		description: 'user email address',
		example: 'alice.smith@example.com'
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'user password',
		example: 'P@ssw0rd!'
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class TokenDto {
	@ApiProperty({
		description: 'JWT ID',
		example: 'some-jti-uuid'
	})
	@IsString()
	@IsNotEmpty()
	jti: string;

	@ApiProperty({
		description: 'Refresh token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}

export class TokenResponseDto {
	@ApiProperty({
		description: 'Access token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	accessToken: string;

	@ApiPropertyOptional({
		description: 'Refresh token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	refreshToken?: string;
}
export class User {
	@ApiProperty()
	Id: string;

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
