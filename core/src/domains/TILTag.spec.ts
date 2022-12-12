import TILValidationError from '../errors/TILValidationError';
import TILTag from './TILTag';

describe('TILTag', () => {
  it.each(['react', 'javascript', 'js', 'typescript', 'html', 'css3', 'es6'])('문자열로 태그 생성 (%p)', (input) => {
    const tag = new TILTag(input);
    expect(tag.name).toBe(input);
  });

  it.each(['React', 'Javascript', 'Typescript', 'HTML', 'CSS'])('대문자를 모두 소문자로 치환하는지 (%p)', (input) => {
    const tag = new TILTag(input);
    expect(tag.name).toBe(input.toLowerCase());
  });

  it.each([
    ['react redux', 'react-redux'],
    ['redux toolkit', 'redux-toolkit'],
    ['a b c d e f g ', 'a-b-c-d-e-f-g'],
  ])('공백을 하이픈으로 잘 치환하는지 (%p -> %p)', (input, expected) => {
    const tag = new TILTag(input);
    expect(tag.name).toBe(expected);
  });

  it.each(['  ', ' ', '\n'])('공백을 허용하지 않는지 (%p)', (input) => {
    expect(() => new TILTag(input)).toThrowError(TILValidationError);
  });

  it.each(['fun*', 'nice^', 'gre@t', 'ㅎㅇㅌ'])('영어, 한글, 숫자 외에 허용하지 않는지', (input) => {
    expect(() => new TILTag(input)).toThrowError(TILValidationError);
  });
});
