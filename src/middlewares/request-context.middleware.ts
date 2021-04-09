import { v4 as uuid } from 'uuid'
import { Request, Response } from 'express'
import { LoggerService } from '../services'
import { HEADERS } from '../../common'

export function RequestContextMiddleware(
  req: Request,
  res: Response,
  next: () => void,
): void {
  req.res.locals.correlationId = req.headers[HEADERS.CORRELATION_ID]
  if (!req.res.locals.correlationId) {
    req.res.locals.correlationId = uuid()
  }
  req.res.locals.logger = new LoggerService({
    level: process.env.LOG_LEVEL,
    correlationId: req.res.locals.correlationId,
  })
  res.header(HEADERS.CORRELATION_ID, req.res.locals.correlationId)
  next()
}
