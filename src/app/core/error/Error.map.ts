import { BaseError } from '.';
import { Result } from '../Result';

export class ErrorMap {
  static toController<T>(error: unknown) {
    if (error instanceof Result) {
      return error as Result<T, BaseError>;
    }
    if (error instanceof BaseError) {
      return Result.fail<T, BaseError>(error);
    }
    return BaseError.unexpected<T>(error);
  }

  static toDTO(error: any) {}
}
