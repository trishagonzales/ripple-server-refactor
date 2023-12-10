import { BaseError } from './error/BaseError';
import { IError } from './error/Error.interface';
import { Result } from './Result';

/**
 * @type I (Input)  - usecase input
 * @type O (Output) - successful execution output
 * @type E (Errors) - possible errors output
 */

export interface Usecase<I, O, E = IError> {
  exec(input: I): Promise<Result<O, E>> | Result<O, E>;
}
