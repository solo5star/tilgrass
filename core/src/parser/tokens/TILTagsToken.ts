import TILTag from '../../domains/TILTag';
import TILError from '../../errors/TILError';
import TILTokenError from '../../errors/TILTokenError';
import Token from './Token';

export default class TILTagsToken extends Token {
  static tryParse(text: string, index: number): TILTagsToken | null {
    if (text[index] !== '#') return null;

    const [start, end] = [index, Token.indexUntilLineEnd(text, index)];
    const line = text.slice(start, end);

    const tagNames = line
      .split('#')
      .map((tagName) => tagName.trim())
      .filter((tagName) => !!tagName);
    return new TILTagsToken(start, end, tagNames);
  }

  constructor(start: number, end: number, public readonly tagNames: string[]) {
    super(start, end);
  }

  compile() {
    try {
      const tags = this.tagNames.map((tagName) => new TILTag(tagName));
      const tagNames = tags.map((tag) => tag.name);

      if (new Set(tagNames).size !== tagNames.length) {
        throw new TILTokenError(this, '태그를 중복하여 사용할 수 없습니다.');
      }
      return tags;
    } catch (error) {
      if (!(error instanceof TILError)) throw error;

      throw new TILTokenError(this, error.message);
    }
  }
}
