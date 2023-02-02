import { View } from '@slack/bolt';

export const TILCreateDoneView = {
  name: 'view-til-create-done' as const,

  create(options?: Partial<{ link: string }>): View {
    return {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'TIL',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: '완료',
        emoji: true,
      },
      blocks: [
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'TIL을 제출하였습니다!',
          },
          accessory: !options?.link ? undefined : {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'TIL 링크 :link:',
              emoji: true,
            },
            value: 'til_link',
            url: options.link,
            action_id: 'button-action',
          },
        },
      ],
    };
  },
};
