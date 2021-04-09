import * as _ from 'lodash'
import { Request, Response } from 'express'
import {
  LoggerService
} from '../services'
import { FunctionMetadata, InCommingRequestLoggingDto } from '../dtos'
import { ILoggingOptions } from '../interfaces'
import { RequestLoggingHelper } from '../utils'
import { ParamsMetadata, ParamMeta } from '../decorators'
import { LOG_LEVEL, FunctionParamtypes } from '../../common'

const logError = (
  logger: LoggerService,
  logLevel: string,
  message: any,
  logInfo: any,
) => {
  switch (logLevel) {
    case LOG_LEVEL.VERBOSE:
      logger.verbose(message, logInfo)
      break
    case LOG_LEVEL.DEBUG:
      logger.debug(message, logInfo)
      break
    case LOG_LEVEL.INFO:
      logger.log(message, logInfo)
      break
    case LOG_LEVEL.WARN:
      logger.warn(message, logInfo)
      break
    case LOG_LEVEL.ERROR:
      logger.error(message, logInfo)
      break
    default:
      logger.log(message, logInfo)
      break
  }
}

export function HttpLoggingMiddleware(
  req: Request,
  res: Response,
  next: () => void,
): void {
  const logger = req.res.locals.logger as LoggerService
  if (!logger) return next()
  const metadata: FunctionMetadata = req.res.locals.function
  const paramsMetadata: ParamsMetadata = metadata
    ? metadata.paramsMetadata
    : null
  const reqBodyMetadata: ParamMeta = _.find(
    paramsMetadata,
    (item: ParamMeta) => item.paramtype === FunctionParamtypes.BODY,
  )
  const reqBodyType = reqBodyMetadata
    ? reqBodyMetadata.metatype
    : null
  const startTime = Date.now()
  res.on('finish', () => {
    const isDebug = logger.isDebugEnabled()
    const logDto = new InCommingRequestLoggingDto()
    logDto.isDebug = isDebug
    logDto.startTime = startTime
    logDto.req = req
    logDto.res = res
    logDto.reqBodyType = reqBodyType
    logDto.resBody = req.res.locals.resBody
    const logInfo = RequestLoggingHelper.inCommingRequest(logDto)
    const { error, errorDto } = req.res.locals
    const logLevel = isDebug ? LOG_LEVEL.DEBUG : req.res.locals.logLevel
    if (error) {
      logInfo.stack = error.stack
    }
    if (errorDto) {
      logInfo.errors = errorDto
    }
    logError(logger, logLevel, 'InComming Request', logInfo)
  })

  next()
}
