import Token from './Token';

export default class TILTagToken extends Token {
  static tryParse(text: string, index: number): TILTagToken | null {
    if (text[index] !== '#') return null;

    const [start, end] = Token.getRangeUntilLineEnd(text, index);
    const line = text.slice(start, end);

    const tags = line
      .split('#')
      .map((tag) => tag.trim())
      .filter((tag) => !!tag);
    return new TILTagToken(start, end, tags);
  }

  constructor(start: number, end: number, public readonly tags: string[]) {
    super(start, end);
  }
}
