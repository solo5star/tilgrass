import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsLoggerMiddleware } from './common/middlewares/requests-logger.middleware';
import { SlackModule } from './slack/slack.module';
import { TilsSlackModule } from './tils-slack/tils-slack.module';
import { TilsModule } from './tils/tils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    EventEmitterModule.forRoot({
      global: true,
    }),
    SlackModule.forRoot({
      isGlobal: true,
      token: process.env.SLACK_API_TOKEN,
      signingSecret: process.env.SLACK_API_SIGNING_SECRET!,
      appToken: process.env.SLACK_API_APP_TOKEN,
    }),
    TilsModule,
    TilsSlackModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestsLoggerMiddleware).forRoutes('*');
  }
}
