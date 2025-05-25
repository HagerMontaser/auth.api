import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
})
export class RefreshToken {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	userId: Types.ObjectId;

	@Prop({ required: true, unique: true })
	refreshToken: string;

	@Prop({ required: true, unique: true })
	jti: string;

	@Prop({ default: false })
	isRevoked: boolean;

	@Prop({ required: true, expires: 0 })
	expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
