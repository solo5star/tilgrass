import TILCommentToken from './TILCommentToken';

describe('TILCommentToken', () => {
  it.each([
    [
      '오늘도 알찬 하루였습니다!!',
      '오늘도 알찬 하루였습니다!!'
    ],
    [
      '오늘은 휴식입니다. ㅜㅜ\n몸이 너무 아프네요...\n',
      '오늘은 휴식입니다. ㅜㅜ'
    ],
    [
      '오늘은 조금 부족했네요.. 내일은 더 빡시게 하겠습니다!!\n',
      '오늘은 조금 부족했네요.. 내일은 더 빡시게 하겠습니다!!',
    ],
  ])('코멘트를 잘 파싱하는지 (%p)', (input, expected) => {
    const token = TILCommentToken.tryParse(input, 0);
    expect(token?.comment).toBe(expected);
  });
});
