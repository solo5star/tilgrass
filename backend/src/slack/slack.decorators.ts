import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export const OnSlackEvent = (eventName: string) => applyDecorators(OnEvent(`slack.event.${eventName}`));

export const OnSlackCommand = (commandName: string) => applyDecorators(OnEvent(`slack.command.${commandName}`));

export const OnSlackView = (viewName: string) => applyDecorators(OnEvent(`slack.view.${viewName}`));

export const OnSlackAction = (actionName: string) => applyDecorators(OnEvent(`slack.action.${actionName}`));
