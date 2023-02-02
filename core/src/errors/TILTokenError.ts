import Token from '../parser/tokens/Token';
import TILParseError from './TILParseError';

export default class TILTokenError extends TILParseError {
  constructor(
    public readonly token: Token,
    message?: string,
  ) {
    super(token.start, message);
  }
}
