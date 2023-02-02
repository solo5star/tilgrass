/* eslint-disable class-methods-use-this */
import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TILParser } from 'tilgrass-core';
import { OnSlackCommand, OnSlackView } from '../slack/slack.decorators';
import { SlackService } from '../slack/slack.service';
import { SlackCommandArgs, SlackViewArgs } from '../slack/types';
import { SocialAccountsService } from '../social-accounts/social-accounts.service';
import { TILDocument } from '../tils/schemas/til.schema';
import { OnTIL } from '../tils/tils.decorators';
import { TilsService } from '../tils/tils.service';
import { UsersService } from '../users/users.service';
import { SlackTILPublish, SlackTILPublishDocument } from './schemas/slack-til-publish.schema';
import { TILCreateDoneView } from './views/til-create-done.view';
import { TILCreateView } from './views/til-create.view';
import { TILMessage } from './views/til.message';

@Injectable()
export class TilsSlackService {
  private readonly logger = new Logger(TilsSlackService.name);

  private readonly tilParser = new TILParser();

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(SlackTILPublish.name)
    private readonly slackTILPublishModel: Model<SlackTILPublishDocument>,
    private readonly users: UsersService,
    private readonly tils: TilsService,
    private readonly slack: SlackService,
    private readonly socialAccounts: SocialAccountsService,
  ) {}

  private async findSocialAccount(slackUserId: string) {
    const socialAccount = await this.socialAccounts.findOne({ provider: 'slack', id: slackUserId });
    if (socialAccount) return socialAccount;

    const { profile } = await this.slack.client.users.profile.get({ user: slackUserId });
    if (!profile?.email) {
      throw new NotAcceptableException(`Slack user (${slackUserId}) does not have email, so request could not be processed.`);
    }

    return this.socialAccounts.upsertOne({
      provider: 'slack',
      id: slackUserId,
      email: profile.email,
      displayName: profile.display_name || profile.real_name || profile.email.split('@').shift() || 'Unknown',
      extraData: profile,
    });
  }

  @OnSlackCommand('til')
  async handleSlackCommand({ ack, client, body, logger }: SlackCommandArgs) {
    const { til: temporalTIL } = this.tilParser.parse(`TIL ${body.text}`);
    const date: Date | null = temporalTIL?.date ?? null;

    if (!date) {
      await ack({
        response_type: 'ephemeral',
        text: '명령어 사용법: /til YYYYMMDD (날짜를 입력해주세요)',
      });
      return;
    }
    const initialDraft = `TIL ${body.text}`;
    await ack();

    const { email, displayName } = await this.findSocialAccount(body.user_id);
    const user = await this.users.preregister({ email, socialName: displayName });
    const til = await this.tils.findOne({ user: user._id, date });

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: TILCreateView.create({ defaultText: til?.originalText ?? initialDraft }),
      });
    } catch (error) {
      logger.error(error);
    }
  }

  @OnSlackView(TILCreateView.name)
  async handleTILCreateView({ body, view, ack }: SlackViewArgs) {
    const originalText = view.state.values.til.input.value ?? '';
    const slackUserId = body.user.id;

    const { email, displayName } = await this.findSocialAccount(slackUserId);
    const user = await this.users.preregister({ email, socialName: displayName });

    const tilParseResult = this.tilParser.parse(originalText);
    if (!tilParseResult.til) {
      await ack({
        response_action: 'errors',
        errors: {
          til: tilParseResult.alerts.map((alert) => alert.message).join(' / '),
        },
      });
      return;
    }

    const til = await this.tils.create(user, { ...tilParseResult.til, originalText });
    await ack({
      response_action: 'update',
      view: TILCreateDoneView.create({ link: `http://localhost:8000/tils/${til._id}` }),
    });
  }

  @OnTIL('save')
  async handleTILSave(til: TILDocument) {
    const userId = ('_id' in til.user) ? til.user._id : til.user;
    const slackTILPublish = await this.slackTILPublishModel.findOne({ til: til._id });
    const user = await this.users.findOne({ _id: userId });

    if (!user) {
      this.logger.error(`TIL posted but user not found. user's id is ${userId}`);
      return;
    }
    const socialAccount = await this.socialAccounts.findOne({ provider: 'slack', email: user.email });
    if (!socialAccount) {
      return;
    }

    if (slackTILPublish) {
      try {
        await this.slack.client.chat.update({
          ts: slackTILPublish.messageId,
          ...TILMessage.create({
            channel: this.configService.getOrThrow('TIL_SLACK_PUBLISH_CHANNEL'),
            slackUserId: socialAccount.id,
            til,
          }),
        });
        return;
      } catch (error) {}
    }

    const { ts: messageId } = await this.slack.client.chat.postMessage(
      TILMessage.create({
        channel: this.configService.getOrThrow('TIL_SLACK_PUBLISH_CHANNEL'),
        slackUserId: socialAccount.id,
        til,
      }),
    );
    await this.slackTILPublishModel.findOneAndUpdate(
      { til: til._id },
      { messageId },
      { upsert: true, returnDocument: 'after' },
    );
  }
}
