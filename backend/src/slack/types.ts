import { AllMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

export type SlackEventArgs<EventType extends string>
  = SlackEventMiddlewareArgs<EventType> & AllMiddlewareArgs<EventType>;

export type SlackCommandArgs = AllMiddlewareArgs & SlackCommandMiddlewareArgs;

export type SlackViewArgs = AllMiddlewareArgs & SlackViewMiddlewareArgs;

export type SlackActionArgs = AllMiddlewareArgs & SlackActionMiddlewareArgs;
