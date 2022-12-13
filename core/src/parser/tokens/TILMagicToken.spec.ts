import TILMagicToken from './TILMagicToken';

describe('TILMagicToken', () => {
  it.each(['TIL 20221202', 'TIL 2022. 12. 01.', 'TIL 2022/12/12'])(
    'TIL 문자열을 인식하여 파싱하는지 (%p)',
    (input) => {
      const token = TILMagicToken.tryParse(input, 0);
      expect([token?.start, token?.end]).toEqual([0, 3]);
    },
  );

  it.each(['Weather is Good', 'T I L', 'Til', 'til'])(
    '파싱되지 말아야 할 문자열들에 대해 null을 잘 반환하는지 (%p)',
    (input) => {
      expect(TILMagicToken.tryParse(input, 0)).toBeNull();
    },
  );
});
