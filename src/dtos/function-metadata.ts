import { ParamsMetadata } from '../decorators/func-params.decorator'
import { DecoratorMetadata } from './decorator-metadata'

export class FunctionMetadata {
  path: string
  method: string
  static: boolean
  statusCode: number
  header: { [key: string]: string }
  paramsMetadata: ParamsMetadata
  middlewares: ((req, res, next) => void)[]
  proxy: boolean
  name: string
  decoratorsMetadata: DecoratorMetadata[]
}
