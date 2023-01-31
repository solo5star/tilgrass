import Token from './Token';

export default class TILDateToken extends Token {
  private static readonly REGEX_DATE = /^(?<year>\d{4})[./-]? ?(?<month>12|11|10|0?\d)[./-]? ?(?<day>31|30|2\d|1\d|0?\d)[.]?/;

  static tryParse(text: string, index: number): TILDateToken | null {
    const start = index;
    const line = text.slice(start, Token.indexUntilLineEnd(text, index));

    const match = line.match(TILDateToken.REGEX_DATE);
    if (!match || !match.groups) {
      return null;
    }

    const date = new Date(0);
    date.setFullYear(
      Number(match.groups.year),
      Number(match.groups.month) - 1,
      Number(match.groups.day),
    );
    if (date === null) return null;

    const end = start + match[0].length;
    return new TILDateToken(start, end, date);
  }

  constructor(start: number, end: number, public readonly date: Date) {
    super(start, end);
  }
}
