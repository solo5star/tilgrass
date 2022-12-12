import Token from './Token';

export default class TILDateToken extends Token {
  private static readonly REGEX_DATE = /^(?<year>\d{4}|\d{2})?(?<month>\d{2})(?<day>\d{2})$/;

  private static readonly REGEX_DATE_SEPARATOR = /[./-]/;

  static tryParse(text: string, index: number): TILDateToken | null {
    const [start, end] = Token.getRangeUntilLineEnd(text, index);
    const line = text.slice(start, end);

    const date = TILDateToken.extractDateFromString(line);
    if (date === null) return null;

    return new TILDateToken(start, end, date);
  }

  private static getDateFromYmd(
    year: string | number | undefined,
    month: string | number,
    day: string | number,
  ): Date | null {
    const currentYear = String(new Date().getFullYear());
    // 년도의 숫자가 4개이면(2022) 그대로 사용
    // 년도의 숫자가 2개이면(22) 현재 년도에서 2자리를 붙여 사용(-> 2022)
    const yearPadded = String(year ?? currentYear).padStart(4, currentYear.slice(0, 2));

    const date = new Date(Number(yearPadded), Number(month) - 1, Number(day));
    if (Number.isNaN(date.valueOf())) return null;

    return date;
  }

  private static extractDateFromString(text: string): Date | null {
    const matchGroups = text.match(TILDateToken.REGEX_DATE)?.groups;
    if (matchGroups) {
      return TILDateToken.getDateFromYmd(matchGroups.year, matchGroups.month, matchGroups.day);
    }

    const dateParts = text
      .split(TILDateToken.REGEX_DATE_SEPARATOR)
      .map((datePart) => datePart.trim())
      .filter((datePart) => !!datePart)
      .filter((datePart) => !TILDateToken.REGEX_DATE_SEPARATOR.test(datePart))
      .map(Number);

    // month, year given. put current year
    if (dateParts.length === 2) {
      dateParts.unshift(new Date().getFullYear());
    }

    if (dateParts.length !== 3) return null;

    const [year, month, day] = dateParts;
    return TILDateToken.getDateFromYmd(year, month, day);
  }

  constructor(start: number, end: number, public readonly date: Date) {
    super(start, end);
  }
}
