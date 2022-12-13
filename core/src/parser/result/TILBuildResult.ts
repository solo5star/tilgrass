import TIL from '../../domains/TIL';
import Alert from './Alert';

export default class TILBuildResult {
  constructor(
    public readonly til: TIL | null,
    public readonly alerts: Alert[] = [],
  ) {}
}
