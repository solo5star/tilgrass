export default class TILItem {
  constructor(
    /**
     * 공부한 내용을 한 줄로 간략하게 나타냅니다.
     */
    public readonly title: string,
    /**
     * 상세 내용입니다.
     */
    public readonly content?: string,
  ) {}
}
