import TILItemToken from './TILItemToken';

describe('TILItemToken', () => {
  it.each([
    ['1. SW 테스팅 경진대회 신청', 'SW 테스팅 경진대회 신청'],
    ['1. Javascript Deep Dive 공부', 'Javascript Deep Dive 공부'],
    ['3.  파이썬 클래스 문법에 대해 공부', '파이썬 클래스 문법에 대해 공부'],
    ['* 클린코드 책 100-240페이지 읽기', '클린코드 책 100-240페이지 읽기'],
    ['- Learn about Vue3 composition API', 'Learn about Vue3 composition API'],
    ['-  Search about AWS Cloud Computing', 'Search about AWS Cloud Computing'],
  ])('제목을 잘 파싱하는지 (%p)', (input, expected) => {
    const token = TILItemToken.tryParse(input, 0);
    expect(token?.title).toBe(expected);
    expect(token?.content).toBeUndefined();
  });

  it.each([
    [
      [
        '1. Slack API 실험',
        '  - Slack API의 모드에는 RTM, Event API두 가지 모드가 있습니다.',
        '  - Block Kit Builder라는 편리한 Slack Component 빌드 툴도 있습니다.',
      ],
      {
        title: 'Slack API 실험',
        content: [
          '  - Slack API의 모드에는 RTM, Event API두 가지 모드가 있습니다.',
          '  - Block Kit Builder라는 편리한 Slack Component 빌드 툴도 있습니다.',
        ],
      },
    ],
    [
      [
        '* 블록체인 입문',
        '  한국에서 국룰로 쓰인다는 클레이튼에 대해 공부',
        '  전 세계에서 가장 많이 쓰이는 이더리움은 스마트 컨트랙트를 배포, 실행할 때 가스비가 상대적으로 많이 비싸다 합니다',
        '  클레이튼의 지갑의 종류는 Klip, Kaikas가 있습니다.',
      ],
      {
        title: '블록체인 입문',
        content: [
          '  한국에서 국룰로 쓰인다는 클레이튼에 대해 공부',
          '  전 세계에서 가장 많이 쓰이는 이더리움은 스마트 컨트랙트를 배포, 실행할 때 가스비가 상대적으로 많이 비싸다 합니다',
          '  클레이튼의 지갑의 종류는 Klip, Kaikas가 있습니다.',
        ],
      },
    ],
    [
      [
        '- OAuth Flow 종류에 대해 공부',
        '  1. Authorization Code Grant',
        '  2. Implicit Grant',
        '  3. Resource Owner Client Grant',
        '  4. Client Credential Grant',
      ],
      {
        title: 'OAuth Flow 종류에 대해 공부',
        content: [
          '  1. Authorization Code Grant',
          '  2. Implicit Grant',
          '  3. Resource Owner Client Grant',
          '  4. Client Credential Grant',
        ],
      },
    ],
  ])('제목과 내용이 함께있는 텍스트를 잘 파싱하는지', (inputLines, expected) => {
    const input = inputLines.join('\n');
    const token = TILItemToken.tryParse(input, 0);

    expect(token?.title).toBe(expected.title);
    expect(token?.content).toBe(expected.content.join('\n'));
  });

  it.each([
    [['1. React HOC 개념 공부', '2. React Hooks 개념 공부', '3. React Hooks 실습'], 'React HOC 개념 공부'],
    [['* 캡스톤 프로젝트 README.md 작성', '* 기말고사 준비'], '캡스톤 프로젝트 README.md 작성'],
  ])('항목이 여러 개 있을 때 잘 파싱되는지', (inputLines, expected) => {
    const input = inputLines.join('\n');
    const token = TILItemToken.tryParse(input, 0);

    expect(token?.title).toBe(expected);
    expect(token?.content).toBeUndefined();
  });

  it.each([
    [
      [
        '* Figma 사용해보기',
        '  - 도형 생성하고 Component 만들어보기',
        '',
        '오늘 바빠서 많이 못했네요...',
      ],
      {
        title: 'Figma 사용해보기',
        content: [
          '  - 도형 생성하고 Component 만들어보기'
        ],
      },
    ],
    [
      [
        '- Typescript ORM 시장 조사',
        '  널리 언급되는건 TypeORM, Prisma, Sequalize',
        'Node.js 라이브러리 종류가 되게 많아서 공부하기가 힘드네요 ㅜㅜ',
      ],
      {
        title: 'Typescript ORM 시장 조사',
        content: [
          '  널리 언급되는건 TypeORM, Prisma, Sequalize'
        ],
      },
    ],
    [
      [
        '3. MVC 개념에 대해 공부',
        '',
        'MVC 외에 MVP, MVVM에 대해서도 한번 알아둬야겠습니다.'
      ],
      {
        title: 'MVC 개념에 대해 공부',
        content: undefined,
      },
    ],
  ])('indent가 없는 라인에 대해 세부 내용으로 포함하지 않는 지', (inputLines, expected) => {
    const input = inputLines.join('\n');
    const token = TILItemToken.tryParse(input, 0);

    expect(token?.title).toBe(expected.title);
    expect(token?.content).toBe(expected.content?.join('\n'));
  });

  it.each([
    [
      [
        '* 백준 몇몇 문제 솔브',
        '  2261 - 가장 가까운 두 점',
        '    분할정복 알고리즘 사용하여 솔브',
        '',
        '',
        '  2671 - 잠수함 식별',
        '    문제에 주어진 조건에 따라 정규식 생성',
        '',
        '드디어 플래티넘 문제를 풀어봤네요... 왤캐 어려운지',
      ],
      {
        title: '백준 몇몇 문제 솔브',
        content: [
          '  2261 - 가장 가까운 두 점',
          '    분할정복 알고리즘 사용하여 솔브',
          '',
          '  2671 - 잠수함 식별',
          '    문제에 주어진 조건에 따라 정규식 생성',
        ],
      },
    ],
  ])('newline이 두개더라도, indent를 인식하여 content가 잘 생성되는지', (inputLines, expected) => {
    const input = inputLines.join('\n');
    const token = TILItemToken.tryParse(input, 0);

    expect(token?.title).toBe(expected.title);
    expect(token?.content).toBe(expected.content.join('\n'));
  });
});
