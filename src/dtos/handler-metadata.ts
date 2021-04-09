import { FunctionMetadata } from './function-metadata'
import { HandlerOptions } from './handler-options'

export class HandlerMetadata {
  functions: FunctionMetadata[]
  proxy: boolean
  options?: HandlerOptions
}
