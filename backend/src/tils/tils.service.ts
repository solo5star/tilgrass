/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as core from 'tilgrass-core';
import { UserDocument } from '../users/schemas/user.schema';
import { TIL, TILDocument } from './schemas/til.schema';

@Injectable()
export class TilsService {
  private readonly logger = new Logger(TilsService.name);

  constructor(
    @InjectModel(TIL.name)
    private readonly tilModel: Model<TILDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async findAll() {
    return this.tilModel.find().exec();
  }

  async findAllBetween(from: Date, to: Date) {
    return this.tilModel.find({ date: { $gte: from, $lte: to } }).exec();
  }

  async findAllToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return this.tilModel.find({ date: today }).exec();
  }

  async findAllYesterday() {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return this.tilModel.find({ date: yesterday }).exec();
  }

  async findAllThisMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth());
    const end = new Date(now.getFullYear(), now.getMonth() + 1);
    return this.tilModel.find({ date: { $gte: start, $lt: end } }).exec();
  }

  async findOne(query: { _id: string } | ({ user: Types.ObjectId } & Pick<TIL, 'date'>)) {
    const til = await this.tilModel.findOne(query).exec();
    return til;
  }

  async create(user: UserDocument, tilDto: core.TIL & Pick<TIL, 'originalText'>) {
    const til = await this.tilModel
      .findOneAndUpdate(
        { user: user._id, date: tilDto.date },
        { user: user._id, ...tilDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();

    this.eventEmitter.emit('til.save', til);

    const summary = [
      til.items[0]?.title,
      til.items[1] && `and ${til.items.length - 1} more items`,
    ].filter((text) => !!text).join(' ') || 'No items';
    this.logger.log(`TIL posted by ${user.name} at ${til.date.toISOString()} (${summary})`);

    return til;
  }

  async remove(_id: string) {
    const removedTil = await this.tilModel
      .findByIdAndRemove(_id)
      .exec();
    return removedTil;
  }
}
