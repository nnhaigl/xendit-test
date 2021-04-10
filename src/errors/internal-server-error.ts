import { LOG_LEVEL, HTTP_STATUS } from '../../common'
import { ErrorDto, ApiError } from '../dtos'

export class InternalServerError extends ApiError {
  constructor(
    errorDto: ErrorDto | Array<ErrorDto>,
    originError?: Error,
    rawData?: any,
  ) {
    super(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      LOG_LEVEL.ERROR,
      errorDto,
      originError,
      rawData,
    )
  }
}
