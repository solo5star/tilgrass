import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export const OnTIL = (eventName: string) => applyDecorators(OnEvent(`til.${eventName}`));
