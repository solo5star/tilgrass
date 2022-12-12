/* eslint-disable class-methods-use-this */
import TIL from '../domains/TIL';
import TILItem from '../domains/TILItem';
import TILTag from '../domains/TILTag';
import TILParseError from '../errors/TILParseError';
import Alert from './result/Alert';
import TILBuildResult from './result/TILBuildResult';
import TILParseResult from './result/TILParseResult';
import TILCommentToken from './tokens/TILCommentToken';
import TILDateToken from './tokens/TILDateToken';
import TILItemToken from './tokens/TILItemToken';
import TILMagicToken from './tokens/TILMagicToken';
import TILTagToken from './tokens/TILTagToken';
import Token from './tokens/Token';

export default class TILParser {
  parse(text: string): TILParseResult {
    const tokens: Token[] = [];

    let index = 0;
    while (index < text.length) {
      // remove blanks
      if ([' ', '\n', '\t'].includes(text[index])) {
        index += 1;
        continue;
      }

      // skip while MAGIC appears
      if (tokens.length === 0) {
        const token = TILMagicToken.tryParse(text, index);
        if (token === null) {
          index += 1;
          continue;
        }
        tokens.push(token);
        index = token.end;
        continue;
      }

      // date must appear right after MAGIC (TIL 20221203)
      if (tokens.length === 1) {
        const token = TILDateToken.tryParse(text, index);
        if (token === null) {
          break; // cannot continue, force quit
        }
        tokens.push(token);
        index = token.end;
        continue;
      }

      // (optional) item, tag, comment can appear
      const token = [
        TILItemToken,
        TILTagToken,
        TILCommentToken,
      ].reduce<Token | null>(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (_token, tokenClass) => _token ?? tokenClass.tryParse(text, index),
        null,
      );
      if (token !== null) {
        tokens.push(token);
        index = token.end;
      }
    }

    const { til, alerts } = this.build(tokens);
    return new TILParseResult(til, text, tokens, alerts);
  }

  build(tokens: Token[]): TILBuildResult {
    const [firstToken, secondToken] = tokens;
    if (!(firstToken instanceof TILMagicToken)) {
      return new TILBuildResult(
        null,
        [new Alert(firstToken.start ?? 0, firstToken.start ?? 0, 'error', 'TIL로 시작해야 합니다.')],
      );
    }

    if (!(secondToken instanceof TILDateToken)) {
      return new TILBuildResult(
        null,
        [new Alert(firstToken.end, firstToken.end, 'error', 'TIL 뒤에는 날짜를 작성해야 합니다.')],
      );
    }
    const { date } = secondToken;

    const items = tokens
      .filter((token): token is TILItemToken => token instanceof TILItemToken)
      .map((token) => new TILItem(token.title, token.content));

    const comment = tokens
      .filter((token): token is TILCommentToken => token instanceof TILCommentToken)
      .map((token) => token.comment)
      .join('\n') || null;

    const tagAlerts: Alert[] = [];
    const tags = tokens
      .filter((token): token is TILTagToken => token instanceof TILTagToken)
      .flatMap((token) => {
        try {
          return token.tags.map((tag) => new TILTag(tag));
        } catch (error) {
          if (!(error instanceof TILParseError)) throw error;

          tagAlerts.push(new Alert(token.start, token.end, 'error', error.message));
          return [];
        }
      });

    if (tagAlerts.length > 0) {
      return new TILBuildResult(null, tagAlerts);
    }

    const til = new TIL(date, items, comment, tags);
    return new TILBuildResult(til);
  }
}
