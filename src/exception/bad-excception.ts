import { HttpException } from './http-exception'
import { HTTP_STATUS } from '../../common'

export class BadRequestException extends HttpException {
  constructor(message?: string | object | any, error = 'Bad Request') {
    super(
      HttpException.createBody(message, error, HTTP_STATUS.BAD_REQUEST),
      HTTP_STATUS.BAD_REQUEST,
    )
  }
}
