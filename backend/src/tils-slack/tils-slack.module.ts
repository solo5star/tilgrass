import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';
import { TilsModule } from '../tils/tils.module';
import { UsersModule } from '../users/users.module';
import { SlackTILPublish, SlackTILPublishSchema } from './schemas/slack-til-publish.schema';
import { TilsSlackService } from './tils-slack.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SlackTILPublish.name, schema: SlackTILPublishSchema }]),
    UsersModule,
    SocialAccountsModule,
    TilsModule,
  ],
  providers: [TilsSlackService],
})
export class TilsSlackModule {}
