import { Result } from '../Result';
import { BaseError } from './BaseError';
import { IError } from './Error.interface';

export class UsecaseError {
  /**
   * Re-emit error result created from other layers (eg. domain, repos)
   * as output of usecase errors (eg. SignupLocal.usecase). Force cast
   * type generic T in Result<T, Error> emitted from other layers to the one
   * required by usecase so typescript won't complain.
   *
   * example
   *   With force cast:
   *   cast type generic T from Avatar to SignupLocalOutput
   *
   *      Result<Avatar, BaseError> --> from domain layer
   *      Result<SignupLocalOutput, BaseError> --> output of usecase layer
   *
   *   Without force cast:
   *   reemit result objects as ouput of usecase without force cast
   *
   *      Result<Avatar, BaseError> --> from domain layer
   *      Result<Avatar, BaseError> --> typescript will complain because
   *                                    type generic T is different to the one
   *                                    configured in usecase (Usecase<Input, Output>)
   */

  static Other<Output>(res: Result<any, IError>) {
    return res as Result<Output, BaseError>;
  }
}
