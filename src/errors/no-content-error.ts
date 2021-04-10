import { LOG_LEVEL, HTTP_STATUS } from '../../common'
import { ErrorDto, ApiError } from '../dtos'

export class NoContentError extends ApiError {
  constructor(originError?: Error) {
    super(HTTP_STATUS.NO_CONTENT, LOG_LEVEL.INFO, undefined, originError)
  }
}
