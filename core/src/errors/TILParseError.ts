import TILError from './TILError';

/**
 * 문자열에서 TIL을 파싱할 때 발생하는 에러입니다.
 */
export default class TILParseError extends TILError {
  constructor(
    /**
     * 문제가 발생한 위치입니다.
     */
    public readonly index: number,
    message?: string,
  ) {
    super(message);
  }
}
