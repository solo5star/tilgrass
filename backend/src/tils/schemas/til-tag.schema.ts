import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class TILTag {
  @Prop({ type: String, required: true })
    name!: string;
}

export const TILTagSchema = SchemaFactory.createForClass(TILTag);
