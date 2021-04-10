import { LOG_LEVEL, HTTP_STATUS } from '../../common'
import { ErrorDto, ApiError } from '../dtos'

export class BadRequestError extends ApiError {
  constructor(errorDto: ErrorDto | Array<ErrorDto>, originError?: Error) {
    super(HTTP_STATUS.BAD_REQUEST, LOG_LEVEL.INFO, errorDto, originError)
  }
}
