import Token from './Token';

export default class TILMagicToken extends Token {
  static readonly MAGIC = 'TIL';

  static tryParse(text: string, index: number): TILMagicToken | null {
    const [start, end] = [index, index + TILMagicToken.MAGIC.length];
    if (text.slice(start, end) !== TILMagicToken.MAGIC) return null;

    return new TILMagicToken(start, end);
  }
}
