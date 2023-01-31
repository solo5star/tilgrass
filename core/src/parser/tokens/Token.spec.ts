import Token from './Token';

describe('Token', () => {
  const text1 = 'abc\n\ndef\nghi';
  it.each([
    [0, 3],
    [1, 3],
    [3, 3],
    [4, 4],
    [5, 8],
    [8, 8],
    [9, 12],
    [12, 12],
  ])(
    '주어진 인덱스에서 다음 newline의 인덱스를 잘 반환하는지',
    (index, expected) => {
      expect(Token.indexUntilLineEnd(text1, index)).toEqual(expected);
    },
  );

  const text2 = 'A BC\n  D\nEFG';
  it.each([
    [0, 1],
    [1, 1],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 8],
    [8, 8],
    [9, 12],
  ])(
    '주어진 인덱스에서 다음 whitespace의 인덱스를 잘 반환하는지',
    (index, expected) => {
      expect(Token.indexUntilWhiteSpace(text2, index)).toEqual(expected);
    },
  );

  const text3 = 'ABC\nD\n\nE';
  it.each([
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 6],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 8],
  ])(
    '주어진 인덱스에서 다음 라인 시작의 index를 잘 반환하는지',
    (index, expected) => {
      expect(Token.indexOfNextLine(text3, index)).toEqual(expected);
    },
  );

  it.each([
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 8],
    [8, 8],
  ])(
    '주어진 인덱스에서 다음 비어있지 않은 라인 시작의 index를 잘 반환하는지',
    (index, expected) => {
      expect(Token.indexOfNextNonBlankLine(text3, index)).toEqual(expected);
    },
  );
});
