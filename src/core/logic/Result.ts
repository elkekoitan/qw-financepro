export class Result<T, E = string> {
  private readonly _isSuccess: boolean;
  private readonly _error: E | undefined;
  private readonly _value: T | undefined;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  public static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, undefined, value);
  }

  public static fail<T = never, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }

  public static combine(results: Result<any>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure()) {
        return Result.fail(result.getError());
      }
    }
    return Result.ok<void>(undefined);
  }

  public isSuccess(): boolean {
    return this._isSuccess;
  }

  public isFailure(): boolean {
    return !this._isSuccess;
  }

  public getValue(): T {
    if (!this._isSuccess || this._value === undefined) {
      throw new Error('Cannot get value of a failed result');
    }
    return this._value;
  }

  public getError(): E {
    if (this._isSuccess || this._error === undefined) {
      throw new Error('Cannot get error of a successful result');
    }
    return this._error;
  }
} 