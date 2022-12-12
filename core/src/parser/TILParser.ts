/* eslint-disable class-methods-use-this */
import TILParseResult from './result/TILParseResult';
import TILCommentToken from './tokens/TILCommentToken';
import TILDateToken from './tokens/TILDateToken';
import TILItemToken from './tokens/TILItemToken';
import TILMagicToken from './tokens/TILMagicToken';
import TILTagToken from './tokens/TILTagToken';
import Token from './tokens/Token';

export default class TILParser {
  parse(text: string): TILParseResult | null {
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
          return null;
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

    return new TILParseResult(text, tokens);
  }
}
