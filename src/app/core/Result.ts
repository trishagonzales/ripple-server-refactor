import { logger } from '../../utils/logger';
import { AppError } from './error';
import { BaseError } from './error/BaseError';
import { IError } from './error/Error.interface';

/**
 * @type T - type of payload from successful execution
 * @type E - type of error
 */

export class Result<T = unknown, E = IError> {
  private _error: E;
  private _value: T;

  private constructor(public isSuccess: boolean, error?: E, value?: T) {
    if (!isSuccess) {
      if (!error) {
        throw `[RESULT] error cannot be empty in unsuccessful operation`;
      } else {
        this._error = error;
      }
    }

    if (value) this._value = value;

    Object.freeze(this);
  }

  get isFailure() {
    return !this.isSuccess;
  }

  get value(): T {
    if (!this.isSuccess) {
      logger(this._error);

      // Throw unexpected error if result.value was accessed
      // in a failed result instead of result.error
      throw new AppError(
        'Result.value not available because operation resulted in error. Access Result.error property instead.',
        'Result.ts',
      );
    }

    return this._value;
  }

  get error(): E {
    return this._error;
  }

  static ok<T, E = BaseError>(value?: T): Result<T, E> {
    return new Result<T, E>(true, undefined, value);
  }

  static fail<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }

  // Merge array of results into one result object

  static merge<T, E = BaseError>(results: Result<T, E>[]): Result<T, E> {
    // if one of results has error, return that one failed result
    for (let result of results) {
      if (!result.isSuccess) return result;
    }

    // no errors
    return Result.ok<T, E>();
  }
}
