import Token from './Token';

describe('Token', () => {
  const text = 'abc\n\ndef\nghi';

  it.each([
    [0, [0, 3]],
    [1, [1, 3]],
    [3, [3, 3]],
    [4, [4, 4]],
    [5, [5, 8]],
    [8, [8, 8]],
    [9, [9, 12]],
    [12, [12, 12]],
  ])(
    '주어진 인덱스에서 다음 newline까지 범위를 잘 반환하는지',
    (index, expected) => {
      expect(Token.untilLineEnd(text, index)).toEqual(expected);
    },
  );
});
