import { ILoggingOptions } from '../interfaces'
import { ClassType } from 'class-transformer/ClassTransformer'
import { ReqOptions } from './req-options'
import { ResponseDto } from './response.dto'

export class OutGoingRequestLoggingDto {
  isDebug: boolean
  startTime: number
  method: string
  path: string
  reqOption: ReqOptions
  res?: ResponseDto
  reqBodyType?: ClassType<ILoggingOptions>
  resBodyType?: ClassType<ILoggingOptions>
}
