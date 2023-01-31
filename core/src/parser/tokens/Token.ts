import TILParseError from '../../errors/TILParseError';

export default abstract class Token {
  static readonly LINE_SEPARATOR = '\n';

  static readonly WHITE_SPACE = ' ';

  /**
   * 주어진 전체 텍스트에서 토큰 파싱을 시도합니다.
   *
   * @param text 전체 텍스트
   * @param index 시작 인덱스
   */
  static tryParse(text: string, index: number): Token | null {
    throw new TILParseError(text, index, 'tryParse가 구현되어 있지 않습니다.');
  }

  static indexUntil(text: string, index: number, searchString: string) {
    const searchStringIndex = text.indexOf(searchString, index);

    return searchStringIndex !== -1 ? searchStringIndex : text.length;
  }

  static indexUntilLineEnd(text: string, index: number) {
    return Token.indexUntil(text, index, Token.LINE_SEPARATOR);
  }

  static indexUntilWhiteSpace(text: string, index: number) {
    return Math.min(
      Token.indexUntil(text, index, Token.WHITE_SPACE),
      Token.indexUntilLineEnd(text, index),
    );
  }

  static indexOfNextLine(text: string, index: number) {
    return Math.min(
      Token.indexUntil(text, index, Token.LINE_SEPARATOR) + 1,
      text.length,
    );
  }

  static indexOfNextNonBlankLine(text: string, index: number) {
    let nextLineIndex = Token.indexOfNextLine(text, index);

    while (nextLineIndex < text.length) {
      const nextLineEndIndex = Token.indexUntilLineEnd(text, nextLineIndex);
      let isNonBlankLine = false;
      for (let i = nextLineIndex; i < nextLineEndIndex; i += 1) {
        if ([' ', '\n', '\r', '\t'].every((blankChar) => text[i] !== blankChar)) {
          isNonBlankLine = true;
          break;
        }
      }
      if (isNonBlankLine) break;

      nextLineIndex = Token.indexOfNextLine(text, nextLineIndex);
    }
    return nextLineIndex;
  }

  constructor(public readonly start: number, public readonly end: number) {}
}
