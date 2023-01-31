import TILDateToken from './TILDateToken';

describe('TILDateToken', () => {
  it.each([
    ['20220103', new Date('2022-01-03')],
    ['2022. 12. 31.', new Date('2022-12-31')],
    ['2021/5/1', new Date('2021-05-01')],
    ['2020-09-03', new Date('2020-09-03')],
    ['2018.10.27', new Date('2018-10-27')],
    ['2015/12/27', new Date('2015-12-27')],
    ['20220305', new Date('2022-03-05')],
    ['2019. 6. 7. ', new Date('2019-06-07')],
    ['2014/7/9', new Date('2014-07-09')],
  ])('날짜 문자열을 정상적으로 파싱하는지 (%p)', (input, expected) => {
    const token = TILDateToken.tryParse(input, 0);
    expect(token?.date.getTime()).toBe(expected.getTime());
  });

  it.each(['123', 'Tuesday', 'Today', '오늘', '22 11 33 99'])(
    '파싱되지 말아야 할 문자열들에 대해 null을 반환하는지 (%p)',
    (input) => {
      expect(TILDateToken.tryParse(input, 0)).toBeNull();
    },
  );
});
