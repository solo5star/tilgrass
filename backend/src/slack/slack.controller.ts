import { All, Controller, Inject, Next, Req, Res } from '@nestjs/common';
import { ExpressReceiver } from '@slack/bolt';
import { Request, Response } from 'express';
import { SLACK_EXPRESS_RECEIVER } from './slack.constants';

@Controller('slack')
export class SlackController {
  constructor(
    @Inject(SLACK_EXPRESS_RECEIVER) private readonly receiver: ExpressReceiver,
  ) {}

  @All('events')
  events(@Req() req: Request, @Res() res: Response, @Next() next) {
    this.receiver.router(req, res, next);
  }
}
