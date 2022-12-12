import TIL from '../domains/TIL';
import TILItem from '../domains/TILItem';
import TILTag from '../domains/TILTag';
import TILParseError from '../errors/TILParseError';
import TILCommentToken from './tokens/TILCommentToken';
import TILDateToken from './tokens/TILDateToken';
import TILItemToken from './tokens/TILItemToken';
import TILMagicToken from './tokens/TILMagicToken';
import TILTagToken from './tokens/TILTagToken';
import Token from './tokens/Token';

export default class TILParseResult {
  constructor(public readonly text: string, public readonly tokens: Token[]) {}

  build(): TIL | null {
    const [firstToken, secondToken] = this.tokens;
    if (!firstToken) return null;

    if (!(firstToken instanceof TILMagicToken)) {
      throw new TILParseError(this.text, firstToken.start, 'TIL로 시작해야 합니다.');
    }

    if (!secondToken) {
      throw new TILParseError(this.text, firstToken.end, 'TIL 뒤에는 날짜를 작성해야 합니다.');
    }
    if (!(secondToken instanceof TILDateToken)) {
      throw new TILParseError(this.text, secondToken.start, 'TIL 뒤에는 날짜를 작성해야 합니다.');
    }
    const { date } = secondToken;

    const items = this.tokens
      .filter((token): token is TILItemToken => token instanceof TILItemToken)
      .map((token) => new TILItem(token.title, token.content));

    const comment = this.tokens
      .filter((token): token is TILCommentToken => token instanceof TILCommentToken)
      .map((token) => token.comment)
      .join('\n') || null;

    const tags = this.tokens
      .filter((token): token is TILTagToken => token instanceof TILTagToken)
      .flatMap((token) => token.tags)
      .map((tag) => new TILTag(tag));

    return new TIL(date, items, comment, tags);
  }
}
