import { Injectable } from '@nestjs/common';
import { Course } from './course.dto';

@Injectable()
export class CoursesService {
	private readonly courses: Course[] = [
		{
			id: '1',
			title: 'NestJS',
			description: 'Learn the fundamentals of NestJS framework',
			duration: 10,
			level: 'Beginner',
			category: 'Backend Development'
		},
		{
			id: '2',
			title: 'React',
			description: 'Get started with React framework',
			duration: 15,
			level: 'Beginner',
			category: 'Frontend Development'
		},
		{
			id: '3',
			title: 'Advanced TypeScript Patterns',
			description: 'Master advanced TypeScript concepts',
			duration: 8,
			level: 'Advanced',
			category: 'Programming'
		}
	];

	findAll(): Course[] {
		return this.courses;
	}
}
