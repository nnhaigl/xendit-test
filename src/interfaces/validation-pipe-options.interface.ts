import { ClassTransformOptions } from './class-transform-options.interface'
import { ValidatorOptions, ValidationError } from 'class-validator'

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean
  disableErrorMessages?: boolean
  transformOptions?: ClassTransformOptions
  exceptionFactory?: (errors: ValidationError[]) => any
  validateCustomDecorators?: boolean
}
