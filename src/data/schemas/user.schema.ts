import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
})
export class User {
	@Prop({ type: mongoose.Schema.Types.String, required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	email: string;

	@Prop()
	address: string;

	@Prop()
	country: string;

	@Prop()
	city: string;

	@Prop({
		match: [/^\+\d{10,15}$/, 'Phone number must be in international format']
	})
	phoneNumber: string;

	@Prop({ required: true, select: false })
	password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
