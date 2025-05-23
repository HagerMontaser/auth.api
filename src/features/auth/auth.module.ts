import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataModule } from 'src/data/data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/data/schemas/user.schema';
import { UserRepository } from 'src/data/repositories/user.repository';
import { AuthController } from './auth.controller';

@Module({
	imports: [DataModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	controllers: [AuthController],
	providers: [UserRepository, AuthService],
	exports: [UserRepository, AuthService]
})
export class AuthModule {}
