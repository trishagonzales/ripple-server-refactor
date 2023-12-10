import { logger } from '../../../utils/logger';
import { Result } from '../Result';
import { IError } from './Error.interface';

export type BaseErrorCodes =
  | 'UNEXPECTED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED';

/**
 * @type T - type of Result.value from successful execution
 */

export class BaseError implements IError<BaseErrorCodes> {
  constructor(public code: BaseErrorCodes, public message?: string) {}

  private static emit<T>(code: BaseErrorCodes, message?: string) {
    return Result.fail<T, BaseError>(new BaseError(code, message));
  }

  static unexpected<T>(
    messageToLogToConsole?: any,
    messageToEndUser?: string,
  ): Result<T, BaseError> {
    logger(`[APP ERROR] ${messageToLogToConsole}`);

    return this.emit<T>(
      'UNEXPECTED',
      messageToEndUser ?? 'Unexpected error occurred',
    );
  }

  static badRequest<T>(message?: string): Result<T, BaseError> {
    return this.emit<T>('BAD_REQUEST', message ?? 'Invalid input');
  }

  static notFound<T>(message?: string): Result<T, BaseError> {
    return this.emit<T>('NOT_FOUND', message ?? 'Resource not found');
  }

  static conflict<T>(message?: string): Result<T, BaseError> {
    return this.emit<T>('CONFLICT', message ?? 'Conflict');
  }

  static unauthenticated<T>(message?: string): Result<T, BaseError> {
    return this.emit<T>('UNAUTHENTICATED', message ?? 'Login required');
  }

  static unauthorized<T>(message?: string): Result<T, BaseError> {
    return this.emit<T>('UNAUTHORIZED', message ?? 'Access denied');
  }
}
