import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { App, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';
import { SLACK_BOLT } from './slack.constants';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  constructor(
    @Inject(SLACK_BOLT)
    private readonly app: App,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initEventHandler();
  }

  get client() {
    return this.app.client;
  }

  private initEventHandler() {
    this.app.event(/.*/, async (eventArgs) => {
      this.emitEvent(eventArgs);
    });
    this.app.command(/.*/, async (commandArgs) => {
      this.emitCommand(commandArgs);
    });
    this.app.view(/.*/, async (viewArgs) => {
      this.emitView(viewArgs);
    });
    this.app.action(/.*/, async (actionArgs) => {
      this.emitAction(actionArgs);
    });
  }

  private emitEvent(eventArgs: SlackEventMiddlewareArgs) {
    const { event } = eventArgs;
    const eventName = [
      'slack',
      'event',
      event.type,
      'subtype' in event ? event.subtype : null,
    ].filter((namespace) => !!namespace).join('.');
    this.eventEmitter.emit(eventName, eventArgs);
  }

  private emitCommand(commandArgs: SlackCommandMiddlewareArgs) {
    const { command } = commandArgs;
    this.eventEmitter.emit(`slack.command.${command.command.replace(/^\//, '')}`, commandArgs);
  }

  private emitView(viewArgs: SlackViewMiddlewareArgs) {
    const { view } = viewArgs;
    this.eventEmitter.emit(`slack.view.${view.callback_id}`, viewArgs);
  }

  private emitAction(actionArgs: SlackActionMiddlewareArgs) {
    const { action } = actionArgs;

    if (!('action_id' in action)) {
      this.logger.warn('Unhandled action ignored');
      this.logger.warn(JSON.stringify(action));
      return;
    }
    this.eventEmitter.emit(`slack.action.${action.action_id}`, actionArgs);
  }
}
