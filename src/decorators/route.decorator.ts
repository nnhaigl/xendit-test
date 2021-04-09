import { ROUTE_METADATA, ALL_HTTP_METHOD, HTTP_METHOD } from '../../common/constants'
import { RouteMetadata } from '../dtos'
import 'reflect-metadata'

export function All(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = ALL_HTTP_METHOD
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}

export function Get(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = HTTP_METHOD.GET
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}

export function Post(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = HTTP_METHOD.POST
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}

export function Put(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = HTTP_METHOD.PUT
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}

export function Delete(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = HTTP_METHOD.DELETE
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}

export function Patch(path: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    const routeMetadata = new RouteMetadata()
    routeMetadata.method = HTTP_METHOD.PATCH
    routeMetadata.path = path
    Reflect.defineMetadata(ROUTE_METADATA, routeMetadata, descriptor.value)
    return descriptor
  }
}