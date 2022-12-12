import TILItem from './TILItem';
import TILTag from './TILTag';

/**
 * TIL 객체입니다.
 *
 * 날짜, 공부한 내용, 소감, 태그 정보를 담고 있습니다.
 */
export default class TIL {
  constructor(
    /**
     * 공부한 날짜입니다.
     */
    public readonly date: Date,
    /**
     * 공부한 내용들입니다.
     */
    public readonly items: TILItem[] = [],
    /**
     * TIL을 마치면서 하고싶은 말(소감)입니다.
     */
    public readonly comment: string | null = null,
    /**
     * 공부한 내용과 연관된 태그들입니다.
     */
    public readonly tags: TILTag[] = [],
  ) {}
}
