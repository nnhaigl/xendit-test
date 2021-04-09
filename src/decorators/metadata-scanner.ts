import { FunctionMetadata } from '../dtos/function-metadata'
import {
  HTTP_CODE_METADATA,
  HEADERS_METADATA,
  ROUTE_ARGS_METADATA,
  ROUTE_METADATA,
  MIDDLEWARES_METADATA,
  PROXY_METADATA,
  CUSTOM_DECORATORS_GROUP,
  HANDLER_OPTIONS
} from '../../common/constants'
import { ParamMeta } from '../decorators/func-params.decorator'
import {
  HandlerMetadata,
  RouteMetadata,
  DecoratorMetadata
} from '../dtos'
import { isConstructor, isFunction, ReflectHelper } from '../../utils'

export class MetadataScanner {
  public static getHandlerMetadatas(
    handler: new (...args) => any,
  ): HandlerMetadata {
    const handlerMetadata = new HandlerMetadata()
    const methodNames =
      Object.getOwnPropertyNames(handler.prototype).filter(
        (key) => !isConstructor(key),
      ) || []
    const handlerInstance = new handler()
    handlerMetadata.functions = []
    for (const method of methodNames) {
      const isFunc = isFunction(handlerInstance[method])
      if (!isFunc) continue

      const metadata = this.getFunctionMetadata(handlerInstance, method)
      if (!metadata) continue

      handlerMetadata.functions.push(metadata)
      if (metadata.proxy) {
        handlerMetadata.proxy = true
        break
      }
    }
    handlerMetadata.options = ReflectHelper.getMetadata(
      HANDLER_OPTIONS,
      handler,
    )
    return handlerMetadata
  }

  public static getFunctionMetadata(
    handler: any,
    fnName: string,
  ): FunctionMetadata {
    const handlerFn = handler[fnName]
    const route: RouteMetadata = ReflectHelper.getMetadata(
      ROUTE_METADATA,
      handlerFn,
    )
    const proxy = ReflectHelper.getMetadata(PROXY_METADATA, handlerFn)
    if (!route && !proxy) return

    const statusCode = ReflectHelper.getMetadata(HTTP_CODE_METADATA, handlerFn)
    const header = ReflectHelper.getMetadata(HEADERS_METADATA, handlerFn)
    const middlewares = ReflectHelper.getMetadata(
      MIDDLEWARES_METADATA,
      handlerFn,
    )
    const paramsMetadata = ReflectHelper.getMetadata(
      ROUTE_ARGS_METADATA,
      handlerFn,
    )

    const datatypes = ReflectHelper.getDesignParameters(fnName, handler)

    const customDecorators: DecoratorMetadata[] = ReflectHelper.getMetadata(
      CUSTOM_DECORATORS_GROUP,
      handlerFn,
    )

    const metadata = new FunctionMetadata()
    if (route) {
      metadata.path = route.path
      metadata.method = route.method
    }

    metadata.header = header
    metadata.statusCode = statusCode
    metadata.paramsMetadata = paramsMetadata
    metadata.middlewares = middlewares
    metadata.proxy = Boolean(proxy)
    metadata.name = fnName
    metadata.decoratorsMetadata = customDecorators

    if (paramsMetadata) {
      Object.entries(paramsMetadata).forEach(([key, value], index) => {
        const meta = value as ParamMeta
        meta.metatype = datatypes[index]
      })
    }

    return metadata
  }
}
