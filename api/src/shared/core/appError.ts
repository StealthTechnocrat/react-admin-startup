import { Error } from "./errors";
import { Result } from "./result";

export namespace AppError {
  export class UnexpectedError extends Result<Error> {
    public constructor(err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
      } as Error);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
