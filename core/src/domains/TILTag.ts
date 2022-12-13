import TILValidationError from '../errors/TILValidationError';

/**
 * 공부한 내용과 연관된 태그입니다.
 *
 * #react #react-redux 같은 태그가 될 수 있으며 값에는 샵(`#`)을 포함하지 않습니다.
 */
export default class TILTag {
  readonly name: string;

  /**
   * 태그를 생성합니다.
   * 대문자가 있는 경우 소문자로 변환하며,
   * 공백이 있으면 하이픈(`-`)으로 바꿔줍니다.
   *
   * @param name 태그 값입니다. 샵(`#`)을 제외한 문자열을 주어야 합니다.
   * @throws {TILValidationError} 문자열이 비어있거나 영어 대문자, 소문자, 한글, 숫자, 공백, 하이픈 외의
   *                              문자가 존재할 시 예외가 발생합니다.
   */
  constructor(name: string) {
    this.name = name.trim().replaceAll(' ', '-').toLowerCase();
    this.validate();
  }

  private validate() {
    if (this.name.length === 0) {
      throw new TILValidationError('공백으로 된 태그는 생성할 수 없습니다.');
    }
    if (!/^[-\d가-힣a-z]+$/.test(this.name)) {
      throw new TILValidationError('태그는 영어, 한글, 숫자로 구성되어야 합니다.');
    }
  }
}
