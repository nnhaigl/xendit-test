import { ROUTE_ARGS_METADATA, FunctionParamtypes } from '../../common/constants'
import { PipeTransform } from '../interfaces/pipe-transform.interface'
import { isNil, isString } from '../../utils'
import { Type } from '../interfaces'

export type ParamOptions = object | string | number
// tslint:disable-next-line: interface-name
export interface ParamMeta {
  paramtype: any
  metatype?: any
  index: number
  options: ParamOptions
  pipes: (Type<PipeTransform> | PipeTransform)[]
}

export interface ParamsMetadata {
  [key: string]: ParamMeta
}

const createParamDecorator = (paramtype: FunctionParamtypes) => (
  decoratorOpts?: any,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator => (controller, method, paramIndex) => {
  const handleFn = controller[method]
  const currentMetadata =
    Reflect.getMetadata(ROUTE_ARGS_METADATA, handleFn) || {}
  const hasParamOptions = isNil(decoratorOpts) || isString(decoratorOpts)
  const options = hasParamOptions ? decoratorOpts : undefined
  const paramPipes = hasParamOptions ? pipes : [decoratorOpts, ...pipes]
  const metadata = assignParamMetadata(
    currentMetadata,
    paramtype,
    paramIndex,
    options,
    ...paramPipes,
  )

  Reflect.defineMetadata(ROUTE_ARGS_METADATA, metadata, handleFn)
}

export function Body(): ParameterDecorator
export function Body(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator
export function Body(
  property?: string | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.BODY)(property, ...pipes)
}

export function Query(): ParameterDecorator
export function Query(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator
export function Query(
  property?: string | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.QUERY)(property, ...pipes)
}

export function Param(): ParameterDecorator
export function Param(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator
export function Param(
  property?: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.PARAM)(property, ...pipes)
}

export function Req(): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.REQUEST)()
}

export function Res(): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.RESPONSE)()
}

export function ResHeader(): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.RESPONSE_HEADER)()
}

export function UploadedFile(): ParameterDecorator {
  return createParamDecorator(FunctionParamtypes.UPLOADED_FILE)()
}

function assignParamMetadata<TParamtype = any, TArgs = ParamMeta>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  options?: ParamOptions,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParamsMetadata {
  return {
    ...args,
    [index]: {
      paramtype,
      index,
      options,
      pipes,
    },
  }
}