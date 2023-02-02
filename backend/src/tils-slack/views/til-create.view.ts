import { View } from '@slack/bolt';

export const TILCreateView = {
  name: 'view-til-create' as const,

  create(options?: Partial<{ defaultText: string }>): View {
    return {
      type: 'modal',
      callback_id: TILCreateView.name,
      title: {
        type: 'plain_text',
        text: 'TIL 작성',
      },
      submit: {
        type: 'plain_text',
        text: '제출',
      },
      close: {
        type: 'plain_text',
        text: '취소',
      },
      blocks: [
        {
          type: 'divider',
        },
        {
          type: 'input',
          block_id: 'til',
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'input',
            focus_on_load: true,
            placeholder: {
              type: 'plain_text',
              text: 'TIL YYYYMMDD\n1. 오늘 했던 일 1\n  - 세부 내용 1\n  - 세부 내용 2\n2. 오늘 했던 일 2\n\n하고 싶은 말\n#react #javascript',
            },
            initial_value: options?.defaultText,
          },
          label: {
            type: 'plain_text',
            text: '아래의 칸에 TIL을 작성해주세요.',
          },
        },
      ],
    };
  },
};
