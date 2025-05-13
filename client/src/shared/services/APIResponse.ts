import { Either } from '../core/either';
import { Result } from '../core/result';
import { APIErrorMessage } from './apiErrorMessage';

export type APIResponse<T> = Either<APIErrorMessage, Result<T>>;
