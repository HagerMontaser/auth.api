import { Controller, Get, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/jwt-auth.guard';
import { Course } from './course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get()
	@UseGuards(AccessGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: [Course] })
	findAll(): Course[] {
		return this.coursesService.findAll();
	}
}
