import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TIL } from '../../tils/schemas/til.schema';

export type SlackTILPublishDocument = HydratedDocument<SlackTILPublish>;

@Schema()
export class SlackTILPublish {
  @Prop({ type: String, required: true, unique: true })
    messageId!: string;

  @Prop({
    type: String, ref: 'TIL', required: true, unique: true,
  })
    til!: TIL;
}

export const SlackTILPublishSchema = SchemaFactory.createForClass(SlackTILPublish);
