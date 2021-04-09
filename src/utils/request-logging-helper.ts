import { CONTENT_LENGTH_HEADER, WHITE_LIST_HEADERS } from '../../common'
import { MaskHelper } from './mask-helper'
import { plainToClass } from 'class-transformer'
import { isNil } from '../../utils'
import { ILoggingOptions } from '../interfaces'
import { OutGoingRequestLoggingDto, InCommingRequestLoggingDto } from '../dtos'
import { ClassType } from 'class-transformer/ClassTransformer'

export class RequestLoggingHelper {
  public static inCommingRequest(logDto: InCommingRequestLoggingDto): any {
    const {
      res,
      req,
      startTime,
      isDebug,
      reqBodyType,
      resBodyType,
      resBody,
    } = logDto
    let contentLength = res ? res.getHeader(CONTENT_LENGTH_HEADER) : null
    if (typeof contentLength === "string") {
      contentLength = parseInt(contentLength)
    } else if (typeof contentLength === "object") {
      contentLength = parseInt(contentLength[0])
    }
    const path = req.baseUrl || req.url
    const statusCode = res ? res.statusCode : null
    const logInfo = {
      ...{ ip: req.ip },
      ...this.basicInfo(
        req.method,
        path,
        statusCode,
        startTime,
        contentLength,
        req.headers,
        null,
      ),
    }

    if (isDebug) {
      return {
        ...logInfo,
        ...this.maskBody(req.body, resBody, reqBodyType, resBodyType),
      }
    }
    return logInfo
  }
  public static outGoingRequest(logDto: OutGoingRequestLoggingDto): any {
    const {
      res,
      reqOption,
      method,
      path,
      startTime,
      isDebug,
      reqBodyType,
      resBodyType,
    } = logDto
    const resHeaders = res ? res.headers : null
    const contentLength: number = resHeaders
      ? +resHeaders[CONTENT_LENGTH_HEADER]
      : null
    const statusCode = res ? res.statusCode : null
    const resBody = res ? res.body : null
    const searchParams =
      reqOption && reqOption.searchParams ? reqOption.searchParams : null
    const logInfo = {
      ...{
        searchParams,
      },
      ...this.basicInfo(
        method,
        path,
        statusCode,
        startTime,
        contentLength,
        reqOption.headers,
        resHeaders,
      ),
    }
    if (isDebug) {
      return {
        ...logInfo,
        ...this.maskBody(reqOption.body, resBody, reqBodyType, resBodyType),
      }
    }
    return logInfo
  }
  private static basicInfo(
    method: string,
    path: string,
    statusCode: number,
    startTime: number,
    contentLength: number,
    reqHeaders?: any,
    resHeaders?: any,
  ): any {
    const duration = Date.now() - startTime
    const reqHeadersMarked = MaskHelper.whiteList(
      reqHeaders,
      WHITE_LIST_HEADERS,
    )
    const resHeadersMarked = MaskHelper.whiteList(
      resHeaders,
      WHITE_LIST_HEADERS,
    )
    const logInfo = {
      method,
      path,
      statusCode,
      duration,
      size: contentLength,
      reqHeaders: reqHeadersMarked,
      resHeaders: resHeadersMarked,
    }
    return logInfo
  }
  private static maskBody(
    reqBody: any,
    resBody: any,
    reqBodyType?: ClassType<ILoggingOptions>,
    resBodyType?: ClassType<ILoggingOptions>,
  ): { reqBody: any; resBody: any } {
    const reqBodyDto = isNil(reqBodyType)
      ? reqBody
      : plainToClass(reqBodyType, reqBody)

    const resBodyDto = isNil(resBodyType)
      ? resBody
      : plainToClass(resBodyType, resBody)
    return {
      reqBody: MaskHelper.whiteListDeep(reqBodyDto),
      resBody: MaskHelper.whiteListDeep(resBodyDto),
    }
  }
}
