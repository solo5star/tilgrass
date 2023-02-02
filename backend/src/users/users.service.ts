import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findOne(query: { _id: Types.ObjectId | string } | Pick<User, 'email'>) {
    const user = await this.userModel.findOne(query).exec();
    return user;
  }

  async updateOne(query: { _id: Types.ObjectId | string }, userDto: Partial<Omit<User, 'email' | 'isRegistered'>>) {
    const user = await this.userModel.findOneAndUpdate(
      query,
      userDto,
      { returnDocument: 'after' },
    );
    return user;
  }

  async preregister(userDto: Pick<User, 'email'> & Partial<Omit<User, 'isRegistered'>>) {
    const user = await this.userModel.findOneAndUpdate(
      { email: userDto.email },
      userDto,
      { upsert: true, returnDocument: 'after' },
    );
    return user;
  }

  async register(userDto: Pick<User, 'email'> & Partial<Omit<User, 'isRegistered'>>) {
    const user = await this.userModel.findOneAndUpdate(
      { email: userDto.email },
      { ...userDto, isRegistered: true },
      { upsert: true, returnDocument: 'after' },
    );
    return user;
  }
}
