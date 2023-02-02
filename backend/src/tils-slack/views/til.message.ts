import { KnownBlock } from '@slack/bolt';
import { TILDocument } from '../../tils/schemas/til.schema';

export const TILMessage = {
  stringifyTILItems(items: TILDocument['items']) {
    return items.map((item, index) => [item, index + 1] as const)
      .map(([item, no]) => `${no}. ${[item.title, item.content].filter((text) => !!text).join('\n')}`)
      .join('\n\n');
  },

  create(options: { channel: string, slackUserId: string, til: TILDocument }) {
    const { channel, slackUserId, til } = options;

    return {
      channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `TIL ${til.date.toLocaleDateString()}`,
          },
        },
        ...(til.items.length > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`${this.stringifyTILItems(til.items)}\`\`\``,
          },
        }] : []),
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: [
              til.comment,
              til.tags.map((tag) => `#${tag.name}`).join(' '),
            ].join('\n') || ' ',
          },
          // accessory: {
          //   type: 'button',
          //   text: {
          //     type: 'plain_text',
          //     text: '자세히 보기',
          //   },
          //   value: `${til._id}`,
          //   action_id: TILMessage.ACTION_DETAIL,
          // },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: 'Posted by',
            },
            {
              type: 'image',
              image_url: '/* TODO */',
              alt_text: 'user avatar',
            },
            {
              type: 'mrkdwn',
              text: `<@${slackUserId}>`,
            },
          ],
        },
        {
          type: 'divider',
        },
      ] as KnownBlock[],
    };
  },
};
