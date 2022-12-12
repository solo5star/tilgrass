export type AlertSeverity = 'error' | 'warning' | 'info';

export default class Alert {
  constructor(
    public readonly start: number,
    public readonly end: number,
    public readonly severity: AlertSeverity,
    public readonly message: string,
  ) {}
}
