import Token from './Token';

export default class TILItemToken extends Token {
  static readonly REGEX_MARKER_ORDERED = /^\d+\./;

  static readonly REGEX_MARKER_UNORDERED = /^[-*] /;

  private static getMarkerRegex(line: string) {
    return [
      TILItemToken.REGEX_MARKER_ORDERED,
      TILItemToken.REGEX_MARKER_UNORDERED,
    ].find((regex) => regex.test(line));
  }

  static tryParse(text: string, index: number): TILItemToken | null {
    const range = Token.untilLineEnd(text, index);
    const start = range[0];
    let end = range[1];
    const line = text.slice(start, end);

    const regexMarker = TILItemToken.getMarkerRegex(line);
    if (!regexMarker) return null;

    const title = line.replace(regexMarker, '').trimStart();

    // no more content
    if (end === text.length) {
      return new TILItemToken(start, end, title);
    }

    // looks like it seems more
    const contentLines = [];
    let [additionalStart, additionalEnd] = [start, end];
    let emptyLineAppear = false;

    while (additionalEnd !== text.length) {
      [additionalStart, additionalEnd] = Token.untilLineEnd(
        text,
        additionalEnd + 1,
      );
      const additionalLine = text.slice(additionalStart, additionalEnd);

      // line seems empty?
      if (!additionalLine.trim()) {
        emptyLineAppear = true;
        continue;
      }

      // line has marker? then this should be next item
      if (TILItemToken.getMarkerRegex(additionalLine)) {
        break; // force content end
      }

      // line has indent?
      if (additionalLine.startsWith('  ')) {
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
