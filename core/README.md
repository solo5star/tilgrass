# tilgrass core

## 사용법

### 텍스트에서 TIL 파싱

```js
const text = `
TIL 20221213

1. Javascript Deep Dive 50~100 페이지 공부
  - 추가적으로 함수형 프로그래밍에 대해서 공부
2. OAuth Flow 방식에 대해 공부
3. 카카오 OAuth 연동 실습

오늘도 열심히 했습니다. 내일은 책 진도를 더 많이 나가야 겠습니다.
#javascript #javascript-deep-dive #oauth
`;
const parser = new TILParser();

// til은 text를 파싱하여 얻은 TIL 클래스의 인스턴스입니다.
// alerts는 파싱 중 발생한 에러, 경고들입니다.
const { til, alerts } = parser.parse(text);

console.log(til);
```

출력

```
TIL {
  date: 2022-12-13T00:00:00.000Z,
  items: [
    TILItem {
      title: 'Javascript Deep Dive 50~100 페이지 공부',
      content: '  - 추가적으로 함수형 프로그래밍에 대해서 공부'
    },
    TILItem { title: 'OAuth Flow 방식에 대해 공부', content: undefined },
    TILItem { title: '카카오 OAuth 연동 실습', content: undefined }
  ],
  comment: '오늘도 열심히 했습니다. 내일은 책 진도를 더 많이 나가야 겠습니다.',
  tags: [
    TILTag { name: 'javascript' },
    TILTag { name: 'javascript-deep-dive' },
    TILTag { name: 'oauth' }
  ]
}
```
