export interface IError<T = string> {
  code: T;
  message?: string;
}
