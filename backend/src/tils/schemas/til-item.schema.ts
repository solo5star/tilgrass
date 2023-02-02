import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class TILItem {
  @Prop({ type: String, required: true })
    title!: string;

  @Prop({ type: String, default: null })
    content!: string | null;
}

export const TILItemSchema = SchemaFactory.createForClass(TILItem);
