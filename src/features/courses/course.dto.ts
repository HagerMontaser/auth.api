import { ApiProperty } from '@nestjs/swagger';

export class Course {
	@ApiProperty()
	id: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	duration: number;

	@ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
	level: string;

	@ApiProperty()
	category: string;
}
