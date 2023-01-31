import Token from './Token';

export default class TILCommentToken extends Token {
  static tryParse(text: string, index: number): TILCommentToken | null {
    const [start, end] = [index, Token.indexUntilLineEnd(text, index)];
    const line = text.slice(start, end);
    return new TILCommentToken(start, end, line);
  }

  constructor(start: number, end: number, public readonly comment: string) {
    super(start, end);
  }
}
