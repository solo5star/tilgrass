import { AppOptions } from '@slack/bolt';

export interface SlackModuleOptions extends Omit<AppOptions, 'signingSecret'>, Required<Pick<AppOptions, 'signingSecret'>> {
  isGlobal?: boolean;
}
