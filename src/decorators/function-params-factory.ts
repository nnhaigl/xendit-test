import { FunctionMetadata } from '../dtos/function-metadata'
import { Request, Response } from 'express'
import { FunctionParamtypes } from '../../common'
import { ParamMeta } from '../decorators/func-params.decorator'
import { isString } from '../../utils'

export class FunctionParamsFactory {
  static create(metadata: FunctionMetadata, req: Request, res: Response) {
    const { paramsMetadata } = metadata
    if (paramsMetadata) {
      return Object.values(paramsMetadata).map((meta) => {
        return this.getValueByParamType(meta, req, res)
      })
    }
    return []
  }

  private static getValueByParamType(
    paramMeta: ParamMeta,
    req: Request,
    res: Response,
  ): any {
    const { paramtype, options } = paramMeta
    const property = options && isString(options) ? options.toString() : null
    switch (paramtype) {
      case FunctionParamtypes.BODY:
        return req.body && property ? req.body[property] : req.body
      case FunctionParamtypes.QUERY:
        return property ? req.query[property] : req.query
      case FunctionParamtypes.PARAM:
        return property ? req.params[property] : req.params
      case FunctionParamtypes.HEADERS:
        return property ? req.headers[property] : req.headers
      case FunctionParamtypes.RESPONSE_HEADER:
        if (!res.locals.headers) {
          res.locals.headers = {}
        }
        return res.locals.headers
      case FunctionParamtypes.REQUEST:
        return req
      case FunctionParamtypes.RESPONSE:
        return res
      case FunctionParamtypes.UPLOADED_FILE:
        return req.file
      default:
        return null
    }
  }
}
