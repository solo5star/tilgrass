import TIL from '../../domains/TIL';
import Token from '../tokens/Token';
import Alert from './Alert';

export default class TILParseResult {
  constructor(
    public readonly til: TIL | null,
    public readonly text: string,
    public readonly tokens: Token[],
    public readonly alerts: Alert[] = [],
  ) {}
}
