import Token from './Token';

export default class TILItemToken extends Token {
  static readonly REGEX_TITLE_MARKER = /^\d+\./;

  static readonly REGEX_CONTENT_MARKER = /^[ *◦•-] /;

  static tryParse(text: string, index: number): TILItemToken | null {
    const start = index;
    let end = Token.indexUntilLineEnd(text, index);
    const line = text.slice(start, end);

    if (!TILItemToken.REGEX_TITLE_MARKER.test(line)) return null;

    const title = line.replace(TILItemToken.REGEX_TITLE_MARKER, '').trimStart();

    // no more content
    if (end === text.length) {
      return new TILItemToken(start, end, title);
    }

    // looks like it seems more
    const contentLines = [];
    let [additionalStart, additionalEnd] = [start, end];
    let emptyLineAppear = false;

    while (additionalEnd !== text.length) {
      [additionalStart, additionalEnd] = [
        additionalEnd + 1,
        Token.indexUntilLineEnd(text, additionalEnd + 1),
      ];
      const additionalLine = text.slice(additionalStart, additionalEnd);

      // line seems empty?
      if (!additionalLine.trim()) {
        emptyLineAppear = true;
        continue;
      }

      // line has marker? then this should be next item
      if (TILItemToken.REGEX_TITLE_MARKER.test(additionalLine)) {
        break; // force content end
      }

      if (TILItemToken.REGEX_CONTENT_MARKER.test(additionalLine)) {
        // if above line empty, add empty line
        if (emptyLineAppear) contentLines.push('');

        emptyLineAppear = false;
        contentLines.push(additionalLine);
        end = additionalEnd;
        continue;
      }

      // line stick with above line?
      // if (!emptyLineAppear) {
      //   contentLines.push(additionalLine);
      //   end = additionalEnd;
      //   continue;
      // }

      // content end
      break;
    }

    if (contentLines.length === 0) return new TILItemToken(start, end, title);

    return new TILItemToken(start, end, title, contentLines.join('\n'));
  }

  constructor(
    start: number,
    end: number,
    public readonly title: string,
    public readonly content?: string,
  ) {
    super(start, end);
  }
}
