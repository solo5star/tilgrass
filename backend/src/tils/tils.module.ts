import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';
import { UsersModule } from '../users/users.module';
import { TIL, TILSchema } from './schemas/til.schema';
import { TilsController } from './tils.controller';
import { TilsService } from './tils.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TIL.name, schema: TILSchema }]),
    UsersModule,
    SocialAccountsModule,
  ],
  controllers: [TilsController],
  providers: [TilsService],
  exports: [TilsService],
})
export class TilsModule {}
