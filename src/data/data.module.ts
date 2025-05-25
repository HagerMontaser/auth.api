import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseOptions } from './mongoose-options';

@Module({
	imports: [MongooseModule.forRootAsync(mongooseOptions)],
	exports: [MongooseModule]
})
export class DataModule {}
