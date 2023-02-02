import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SlackLogger } from './slack-logger';
import { SlackModuleOptions } from './slack-options.interface';
import { SLACK_MODULE_OPTIONS } from './slack.constants';
import { SlackController } from './slack.controller';
import { createAsyncBolt, createAsyncExpressReceiver } from './slack.providers';
import { SlackService } from './slack.service';

@Module({
  providers: [SlackService, SlackLogger],
  exports: [SlackService],
  controllers: [SlackController],
})
export class SlackModule {
  static forRoot(options: SlackModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: SLACK_MODULE_OPTIONS,
        useValue: options,
      },
      createAsyncExpressReceiver(),
      createAsyncBolt(),
    ];

    return {
      global: options.isGlobal,
      module: SlackModule,
      providers,
      exports: providers,
    };
  }
}
