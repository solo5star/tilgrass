import { Provider } from '@nestjs/common';
import { ExpressReceiver } from '@slack/bolt';
import { SlackLogger } from './slack-logger';
import { SlackModuleOptions } from './slack-options.interface';
import { SLACK_BOLT, SLACK_EXPRESS_RECEIVER, SLACK_MODULE_OPTIONS } from './slack.constants';

export function createAsyncExpressReceiver(): Provider {
  return {
    provide: SLACK_EXPRESS_RECEIVER,
    inject: [SLACK_MODULE_OPTIONS],
    useFactory: async (options: SlackModuleOptions) => new ExpressReceiver({
      signingSecret: options.signingSecret,
      endpoints: '*',
    }),
  };
}

export function createAsyncBolt(): Provider {
  return {
    provide: SLACK_BOLT,
    inject: [SLACK_MODULE_OPTIONS, SLACK_EXPRESS_RECEIVER, SlackLogger],
    useFactory: async (
      options: SlackModuleOptions,
      receiver: ExpressReceiver,
      logger: SlackLogger,
    ) => {
      const { App } = await import('@slack/bolt');
      const app = new App({
        logger,
        receiver,
        ...options,
      });
      await app.start();
      return app;
    },
  };
}
