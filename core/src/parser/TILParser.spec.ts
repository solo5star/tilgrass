import TIL from '../domains/TIL';
import TILItem from '../domains/TILItem';
import TILTag from '../domains/TILTag';
import TILParser from './TILParser';
import TILCommentToken from './tokens/TILCommentToken';
import TILDateToken from './tokens/TILDateToken';
import TILItemToken from './tokens/TILItemToken';
import TILMagicToken from './tokens/TILMagicToken';
import TILTagToken from './tokens/TILTagToken';

describe('TILParser', () => {
  it.each([
    [
      [
        'TIL 20220903',
        '',
        '1. Javascript Generator 문법에 대해 공부',
        '2. Javascript 코드 포맷팅 툴인 ESLint, Prettier에 대해 공부',
        '',
        'Javascript에 대해 깊게 공부하였네요',
        '',
        '#javascript #eslint #prettier',
      ],
      [
        TILMagicToken,
        TILDateToken,
        TILItemToken,
        TILItemToken,
        TILCommentToken,
        TILTagToken,
      ],
      [
        'TIL',
        '20220903',
        '1. Javascript Generator 문법에 대해 공부',
        '2. Javascript 코드 포맷팅 툴인 ESLint, Prettier에 대해 공부',
        'Javascript에 대해 깊게 공부하였네요',
        '#javascript #eslint #prettier',
      ],
      new TIL(
        new Date('2022-09-03'),
        [
          new TILItem('Javascript Generator 문법에 대해 공부'),
          new TILItem(
            'Javascript 코드 포맷팅 툴인 ESLint, Prettier에 대해 공부',
          ),
        ],
        'Javascript에 대해 깊게 공부하였네요',
        [
          new TILTag('javascript'),
          new TILTag('eslint'),
          new TILTag('prettier'),
        ],
      ),
    ],
    [
      [
        'TIL 2020. 3. 27.',
        '* node 패키지 관리자에 대해서 공부',
        '  - npm',
        '  - yarn',
        '  - pnpm',
        '',
        '* WSL2 설치 및 셋업',
        '  WSL2 활성화 및 몇몇 패키지 설치',
        '  > apt install -y git curl wget neofetch',
        '',
        '#nodejs #npm #yarn #pnpm #wsl #linux',
        '내일은 Docker에 대해 공부해보겠습니다.',
      ],
      [
        TILMagicToken,
        TILDateToken,
        TILItemToken,
        TILItemToken,
        TILTagToken,
        TILCommentToken,
      ],
      [
        'TIL',
        '2020. 3. 27.',
        '* node 패키지 관리자에 대해서 공부\n  - npm\n  - yarn\n  - pnpm',
        '* WSL2 설치 및 셋업\n  WSL2 활성화 및 몇몇 패키지 설치\n  > apt install -y git curl wget neofetch',
        '#nodejs #npm #yarn #pnpm #wsl #linux',
        '내일은 Docker에 대해 공부해보겠습니다.',
      ],
      new TIL(
        new Date('2020-03-27'),
        [
          new TILItem(
            'node 패키지 관리자에 대해서 공부',
            '  - npm\n  - yarn\n  - pnpm',
          ),
          new TILItem(
            'WSL2 설치 및 셋업',
            '  WSL2 활성화 및 몇몇 패키지 설치\n  > apt install -y git curl wget neofetch',
          ),
        ],
        '내일은 Docker에 대해 공부해보겠습니다.',
        [
          new TILTag('nodejs'),
          new TILTag('npm'),
          new TILTag('yarn'),
          new TILTag('pnpm'),
          new TILTag('wsl'),
          new TILTag('linux'),
        ],
      ),
    ],
    [
      ['TIL 19/03/27', '오늘은 휴식입니다...', '내일 뵙겠습니다'],
      [TILMagicToken, TILDateToken, TILCommentToken, TILCommentToken],
      ['TIL', '19/03/27', '오늘은 휴식입니다...', '내일 뵙겠습니다'],
      new TIL(
        new Date('2019-03-27'),
        [],
        '오늘은 휴식입니다...\n내일 뵙겠습니다',
        [],
      ),
    ],
  ])(
    'TIL 텍스트가 주어지면 잘 파싱하는지',
    (inputLines, expectedTokenClasses, expectedTokenTexts, expectedTIL) => {
      const input = inputLines.join('\n');
      const parser = new TILParser();
      const parseResult = parser.parse(input);

      expect(
        parseResult?.tokens.map((token) => token.constructor.name),
      ).toEqual(expectedTokenClasses.map((tokenClass) => tokenClass.name));
      expect(
        parseResult?.tokens.map((token) => input.slice(token.start, token.end)),
      ).toEqual(expectedTokenTexts);
      expect(parseResult?.build()).toEqual(expectedTIL);
    },
  );
});
