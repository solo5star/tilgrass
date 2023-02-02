import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String, required: true, unique: true, index: true,
  })
    email!: string;

  @Prop({
    type: String,
    default: null,
    get(this: User, value) {
      return value ?? this.socialName ?? this.email.split('@').shift();
    },
  })
    name!: string;

  @Prop({ type: String, default: null })
    socialName!: string | null;

  @Prop({ type: Boolean, required: true, default: false })
    isRegistered!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
