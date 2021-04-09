import { ILoggingOptions } from '../interfaces'
import { ClassType } from 'class-transformer/ClassTransformer'
import { Request, Response } from 'express'

export class InCommingRequestLoggingDto {
  isDebug: boolean
  startTime: number
  req: Request
  resBody: any
  res?: Response
  reqBodyType?: ClassType<ILoggingOptions>
  resBodyType?: ClassType<ILoggingOptions>
}
