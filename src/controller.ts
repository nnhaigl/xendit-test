import { Request, Response, Router } from 'express'
import * as express from 'express'
import * as _ from 'lodash'
import {
  FunctionParamsFactory,
  ParamsMetadata,
} from './decorators'
import { HTTP_STATUS, FunctionParamtypes } from '../common'
import { FunctionMetadata, HandlerMetadata } from './dtos'
import { ValidationPipe } from './pipes'
import { PipeTransform } from './interfaces'
import {
  isNil,
  isObject,
  isString,
} from '../utils'
import * as path from 'path'

export class Controller {
  private defaultHeaders: any
  private router: Router
  constructor(private handler: any, private handlerMetadata: HandlerMetadata) {
    this.defaultHeaders = {
      'content-type': 'application/json',
    }
  }

  public registerAPIs(): Router {
    this.router = express.Router()
    if (
      this.handlerMetadata &&
      this.handlerMetadata.options &&
      this.handlerMetadata.options.static
    ) {
      const {
        route,
        path: dirPath,
        options,
      } = this.handlerMetadata.options.static
      this.serveStatic(route, dirPath, options)
    }
    Object.values(this.handlerMetadata.functions).forEach(
      this.registerAPI.bind(this),
    )
    return this.router
  }

  private registerAPI(metadata: FunctionMetadata): void {
    const fnMiddlewares = metadata.middlewares || []

    const preInterceptor = this.createPreMiddlewareInterceptor(metadata)
    if (metadata.proxy) {
      const interceptor = this.createPostMiddlewareInterceptor(metadata)
      this.router.all('*', preInterceptor, fnMiddlewares, interceptor)
    } else {
      const httpMethod = metadata.method.toLocaleLowerCase()
      this.registerPipes(metadata)
      const route = metadata && metadata.path ? metadata.path : '/*'
      const interceptor = this.createPostMiddlewareInterceptor(metadata)
      this.router[httpMethod](route, preInterceptor, fnMiddlewares, interceptor)
    }
  }

  private serveStatic(route: string, dirPath: string, options?: any): void {
    const staticRoute = route || '/'
    const directory = path.join(__dirname, 'function', dirPath)
    this.router.use(staticRoute, express.static(directory, options))
  }

  private registerPipes(metadata: FunctionMetadata): void {
    if (!metadata.paramsMetadata) return
    const valdiationPipe = new ValidationPipe()
    Object.entries(metadata.paramsMetadata).forEach(([, value]) => {
      const pipes = value.pipes || []
      pipes.push(valdiationPipe)
      value.pipes = pipes
    })
  }

  private createPreMiddlewareInterceptor(metadata: FunctionMetadata) {
    return (req: Request, res: Response, next: Function) => {
      req.res.locals.function = metadata
      next()
    }
  }

  private createPostMiddlewareInterceptor(metadata: FunctionMetadata) {
    return (req: Request, res: Response, next: Function) => {
      return this.intercept(metadata, req, res, next)
    }
  }

  private async intercept(
    metadata: FunctionMetadata,
    req: Request,
    res: Response,
    next: Function,
  ) {
    try {
      const func = this.handler[metadata.name].bind(this.handler)
      const args = FunctionParamsFactory.create(metadata, req, res)
      const transformedArgs = await this.transform(metadata, args)
      const body = await func.apply(null, transformedArgs)
      req.res.locals.resBody = body
      if (!body) return res.status(HTTP_STATUS.OK).send(null)
      const resHeaders = this.getResHeaders(
        metadata.paramsMetadata,
        transformedArgs,
      )
      let status = HTTP_STATUS.OK
      let headers = this.defaultHeaders
      if (metadata) {
        const { header, statusCode } = metadata
        headers = Object.assign({}, this.defaultHeaders, header, resHeaders)
        if (statusCode) {
          status = statusCode
        }
      }

      res.status(status).set(headers)
      if (isNil(body)) {
        return res.send()
      }
      return isObject(body) ? res.json(body) : res.send(String(body))
    } catch (error) {
      next(error)
    }
  }

  private existsParamType(
    paramsMetadata: ParamsMetadata,
    paramType: FunctionParamtypes,
  ) {
    return !!Object.values(paramsMetadata).find(
      value => value && value.paramtype === paramType,
    )
  }

  private getResHeaders(
    paramsMetadata: ParamsMetadata,
    transformedArgs: any[],
  ) {
    const resHeaderMetadata = Object.values(paramsMetadata).find(
      value => value && value.paramtype === FunctionParamtypes.RESPONSE_HEADER,
    )
    return resHeaderMetadata ? transformedArgs[resHeaderMetadata.index] : {}
  }

  private async transform(
    metadata: FunctionMetadata,
    args: any[],
  ): Promise<any[]> {
    if (!metadata || !metadata.paramsMetadata || args.length === 0) return Promise.resolve(args)
    const metadatas = Object.values(metadata.paramsMetadata)
    const promises = args.map((arg, index) => {
      const paramMeta = metadatas[index]
      return paramMeta.pipes.reduce(async (result, pipe: PipeTransform) => {
        const currentVal = await result
        return pipe.transform(currentVal, {
          metatype: paramMeta.metatype,
          options: isString(paramMeta.options) ? paramMeta.options : null,
          type: null,
        })
      }, Promise.resolve(arg))
    })
    return Promise.all(promises)
  }
}
