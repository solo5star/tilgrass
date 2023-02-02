import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SocialAccountDocument = HydratedDocument<SocialAccount>;

@Schema()
export class SocialAccount {
  @Prop({ required: true })
    provider!: string;

  @Prop({ required: true })
    id!: string;

  @Prop({ required: true })
    email!: string;

  @Prop({ required: true })
    displayName!: string;

  @Prop({ type: {} })
    extraData: any;
}

export const SocialAccountSchema = SchemaFactory.createForClass(SocialAccount);

SocialAccountSchema.index({ provider: 1, id: 1 }, { unique: true });

SocialAccountSchema.index({ provider: 1, email: 1 }, { unique: true });
