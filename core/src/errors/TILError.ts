/**
 * TIL과 연관하여 발생하는 에러는 모두 이 클래스의 서브클래스입니다.
 */
export default abstract class TILError extends Error {
  constructor(message?: string) {
    super(message ?? 'General TIL error');
    this.name = this.constructor.name;
  }
}
