/* eslint-disable class-methods-use-this */
import TIL from '../domains/TIL';
import TILTokenError from '../errors/TILTokenError';
import TILValidationError from '../errors/TILValidationError';
import Alert from './result/Alert';
import TILBuildResult from './result/TILBuildResult';
import TILParseResult from './result/TILParseResult';
import TILCommentToken from './tokens/TILCommentToken';
import TILDateToken from './tokens/TILDateToken';
import TILItemToken from './tokens/TILItemToken';
import TILMagicToken from './tokens/TILMagicToken';
import TILTagsToken from './tokens/TILTagsToken';
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
        index = Token.indexOfNextNonBlankLine(text, token.end);
        continue;
      }

      // (optional) item, tag, comment can appear
      const token = [
        TILItemToken,
        TILTagsToken,
        TILCommentToken,
      ].reduce<Token | null>(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (_token, tokenClass) => _token ?? tokenClass.tryParse(text, index),
        null,
      );
      if (token !== null) {
        tokens.push(token);
        index = Token.indexOfNextNonBlankLine(text, token.end);
        continue;
      }

      // add if additional parse need
    }

    const { til, alerts } = this.build(text, tokens);
    return new TILParseResult(til, text, tokens, alerts);
  }

  private build(text: string, tokens: Token[]): TILBuildResult {
    const [firstToken, secondToken] = tokens;
    if (!(firstToken instanceof TILMagicToken)) {
      const start = firstToken instanceof Token ? firstToken.start : 0;
      return new TILBuildResult(
        null,
        [new Alert(start, text.length, 'error', 'TIL로 시작해야 합니다.')],
      );
    }

    if (!(secondToken instanceof TILDateToken)) {
      return new TILBuildResult(
        null,
        [new Alert(firstToken.end, firstToken.end, 'error', 'TIL 뒤에는 날짜를 작성해야 합니다.')],
      );
    }
    const date = secondToken.compile();

    const items = tokens
      .filter((token): token is TILItemToken => token instanceof TILItemToken)
      .map((token) => token.compile());

    const comment = tokens
      .filter((token): token is TILCommentToken => token instanceof TILCommentToken)
      .map((token) => token.compile())
      .join('\n')
      .trim() || null;

    const alerts: Alert[] = [];
    const tags = tokens
      .filter((token): token is TILTagsToken => token instanceof TILTagsToken)
      .flatMap((token) => {
        try {
          return token.compile();
        } catch (error) {
          if (!(error instanceof TILTokenError)) throw error;

          alerts.push(new Alert(token.start, token.end, 'error', error.message));
          return [];
        }
      });

    if (alerts.some(alert => alert.severity === 'error')) {
      return new TILBuildResult(null, alerts);
    }

    try {
      const til = new TIL(date, items, comment, tags);
      return new TILBuildResult(til, alerts);
    }
    catch (error) {
      if (!(error instanceof TILValidationError)) throw error;

      return new TILBuildResult(null, [
        ...alerts,
         new Alert(0, text.length, 'error', error.message),
      ]);
    }
  }
}
