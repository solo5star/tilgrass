/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialAccount, SocialAccountDocument } from './schemas/social-accounts.schema';

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectModel(SocialAccount.name)
    private readonly socialAccountModel: Model<SocialAccountDocument>,
  ) {}

  async findAll() {
    const socialAccounts = await this.socialAccountModel.find().exec();
    return socialAccounts;
  }

  async findOne(query: Pick<SocialAccount, 'provider' | 'id'> | Pick<SocialAccount, 'provider' | 'email'>) {
    const socialAccount = await this.socialAccountModel.findOne(query).exec();
    return socialAccount;
  }

  async upsertOne(socialAccountDto: SocialAccount) {
    const socialAccount = await this.socialAccountModel
      .findOneAndUpdate(
        { provider: socialAccountDto.provider, id: socialAccountDto.id },
        socialAccountDto,
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return socialAccount;
  }
}
