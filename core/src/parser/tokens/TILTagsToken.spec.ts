import TILTagsToken from './TILTagsToken';

describe('TILTagToken', () => {
  it.each([
    ['#react #vue #js', ['react', 'vue', 'js']],
    ['#html5 #javascript #css3', ['html5', 'javascript', 'css3']],
  ])('태그를 정상적으로 파싱하는지 (%p)', (input, expected) => {
    expect(TILTagsToken.tryParse(input, 0)?.tagNames).toEqual(expected);
  });

  it.each(['C#의 장점', 'Javascript에서 # 키워드', '...#....######....'])(
    '태그로 인식되지 말아야 할 문자열에 대해 null을 반환하는지 (%p)',
    (input) => {
      expect(TILTagsToken.tryParse(input, 0)).toBeNull();
    },
  );
});
