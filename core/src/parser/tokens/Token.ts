import TILParseError from '../../errors/TILParseError';

export default abstract class Token {
  static readonly LINE_SEPARATOR = '\n';

  /**
   * 주어진 전체 텍스트에서 토큰 파싱을 시도합니다.
   *
   * @param text 전체 텍스트
   * @param index 시작 인덱스
   */
  static tryParse(text: string, index: number): Token | null {
    throw new TILParseError(text, index, 'tryParse가 구현되어 있지 않습니다.');
  }

  static untilLineEnd(text: string, index: number): [number, number] {
    const lineEnd = text.indexOf(Token.LINE_SEPARATOR, index);

    if (lineEnd === -1) return [index, text.length];

    return [index, lineEnd];
  }

  constructor(public readonly start: number, public readonly end: number) {}
}
