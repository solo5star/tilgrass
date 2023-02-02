import { Logger as NestLogger } from '@nestjs/common';
import { Logger as ISlackLogger, LogLevel } from '@slack/bolt';

export class SlackLogger implements ISlackLogger {
  private readonly logger = new NestLogger('Slack');

  private name: string | null = null;

  format(...msg: any[]): string {
    const text = msg.join(' ');
    if (this.name === null) {
      return text;
    }
    return `[${this.name}] ${text}`;
  }

  isLogLevelEnabled(level: LogLevel): boolean {
    return process.env.NODE_ENV === 'development' ? true : level !== LogLevel.DEBUG;
  }

  debug(...msg: any[]): void {
    if (!this.isLogLevelEnabled(LogLevel.DEBUG)) return;
    this.logger.debug(this.format(...msg));
  }

  warn(...msg: any[]): void {
    if (!this.isLogLevelEnabled(LogLevel.WARN)) return;
    this.logger.warn(this.format(...msg));
  }

  error(...msg: any[]): void {
    if (!this.isLogLevelEnabled(LogLevel.ERROR)) return;
    this.logger.error(this.format(...msg));
  }

  info(...msg: any[]): void {
    if (!this.isLogLevelEnabled(LogLevel.INFO)) return;
    this.logger.log(this.format(...msg));
  }

  setLevel(level: LogLevel): void {
    this.logger.warn(`Setting logLevel of slack bolt to ${level} would be ignored`);
  }

  getLevel(): LogLevel {
    return process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN;
  }

  setName(name: string): void {
    this.name = name;
  }
}
