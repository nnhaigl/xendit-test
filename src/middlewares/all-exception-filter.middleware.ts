import { Request, Response } from 'express'
import { HttpException } from '../exception/http-exception'
import { ValidationError } from 'class-validator'
import {
  LOG_LEVEL,
  HTTP_STATUS,
} from '../../common'
import { ApiError, ErrorDto, ValidationErrorHelper } from '../dtos'

export function AllExceptionFilterMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: (...args) => void,
): void {
  const logger = req.res.locals.logger
  req.res.locals.error = error
  let errors
  if (error instanceof ApiError) {
    const apiError = error
    errors = apiError.errors
    req.res.locals.errorDto = errors
    req.res.locals.logLevel = LOG_LEVEL.WARN
    res.status(apiError.statusCode).json({
      errors: errors,
    })
  } else {
    const httpException =
      error instanceof HttpException ? (error as HttpException) : null
    const isValidationError =
      httpException &&
      httpException.message &&
      httpException.message.message &&
      httpException.message.message[0] instanceof ValidationError
    if (isValidationError) {
      const status = httpException.getStatus()
      const rawMessages = httpException.message.message
      const {
        Message,
        MessageValues,
      } = ValidationErrorHelper.parseValidationMessage(rawMessages)
      const errorDto = new ErrorDto(HTTP_STATUS[status], Message, MessageValues)
      req.res.locals.errorDto = errorDto
      req.res.locals.logLevel = LOG_LEVEL.WARN
      res.status(status).json({
        errors: [errorDto],
      })
    } else if (httpException) {
      const status = httpException.getStatus()
      const rawMessages = httpException.message.message
      const errorDto = new ErrorDto(HTTP_STATUS[status], rawMessages)
      req.res.locals.errorDto = errorDto
      req.res.locals.logLevel = LOG_LEVEL.WARN
      res.status(status).json({
        errors: [errorDto],
      })
    } else {
      logger.error(error)
      const msgKey = HTTP_STATUS[HTTP_STATUS.INTERNAL_SERVER_ERROR]
      const errorDto = new ErrorDto(msgKey, 'Internal Server Error')
      req.res.locals.errorDto = errorDto
      req.res.locals.logLevel = LOG_LEVEL.ERROR
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        errors: [errorDto],
      })
    }
  }
}
