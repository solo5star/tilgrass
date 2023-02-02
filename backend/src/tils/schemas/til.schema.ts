import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { TILItem, TILItemSchema } from './til-item.schema';
import { TILTag, TILTagSchema } from './til-tag.schema';

export type TILDocument = HydratedDocument<TIL>;

function validateTags(tags: TILTag[]) {
  return new Set(tags.map((tag) => tag.name)).size === tags.length;
}

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class TIL {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user!: Types.ObjectId | UserDocument;

  @Prop({ type: Date, required: true })
    date!: Date;

  @Prop({ type: [TILItemSchema], default: [] })
    items!: TILItem[];

  @Prop({ type: String, default: null })
    comment!: string | null;

  @Prop({ type: [TILTagSchema], default: [], validate: validateTags })
    tags!: TILTag[];

  @Prop({ type: String, default: null })
    originalText!: string | null;
}

export const TILSchema = SchemaFactory.createForClass(TIL);

TILSchema.index({ user: 1, date: 1 }, { unique: true });
