export class Result<T> {
  unwrap() {
      throw new Error("Method not implemented.");
  }
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _error: T | string | null;
  private readonly _value: T | null;

  private constructor(
    isSuccess: boolean,
    error?: T | string | null,
    value?: T,
  ) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error || null;
    this._value = value !== undefined ? value : null;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead.",
      );
    }

    return this._value as T;
  }

  public errorValue(): T | string {
    return this._error as T | string;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<void>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
