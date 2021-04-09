import { ValidatorOptions, ClassTransformOptions } from '../interfaces'
import {
  PipeTransform,
  ArgumentMetadata,
} from '../interfaces/pipe-transform.interface'
import { BadRequestException } from '../exception/bad-excception'
import { ValidationError } from 'class-validator'
import { loadPackage, isNil } from '../../utils'
import { ValidationPipeOptions } from '../interfaces'

let classValidator: any = {}
let classTransformer: any = {}
export class ValidationPipe implements PipeTransform<any> {
  protected isTransformEnabled: boolean
  protected isDetailedOutputDisabled?: boolean
  protected validatorOptions: ValidatorOptions
  protected transformOptions: ClassTransformOptions
  protected exceptionFactory: (errors: ValidationError[]) => any
  protected validateCustomDecorators: boolean

  constructor(options?: ValidationPipeOptions) {
    options = options || {}
    const {
      transform,
      disableErrorMessages,
      transformOptions,
      validateCustomDecorators,
      ...validatorOptions
    } = options
    this.isTransformEnabled = !!transform
    this.validatorOptions = validatorOptions
    this.transformOptions = transformOptions
    this.isDetailedOutputDisabled = disableErrorMessages
    this.validateCustomDecorators = validateCustomDecorators || false
    this.exceptionFactory =
      options.exceptionFactory ||
      ((errors) =>
        new BadRequestException(
          this.isDetailedOutputDisabled ? undefined : errors,
        ))

    classValidator = loadPackage('class-validator', 'ValidationPipe', () =>
      require('class-validator'),
    )
    classTransformer = loadPackage('class-transformer', 'ValidationPipe', () =>
      require('class-transformer'),
    )
  }

  public async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.toValidate(metadata)) {
      return value
    }
    const originalValue = value
    value = this.toEmptyIfNil(value)

    const isNil = value !== originalValue
    const isPrimitive = this.isPrimitive(value)
    this.stripProtoKeys(value)
    let entity = classTransformer.plainToClass(
      metatype,
      value,
      this.transformOptions,
    )

    const originalEntity = entity
    const isCtorNotEqual = entity.constructor !== metatype

    if (isCtorNotEqual && !isPrimitive) {
      entity.constructor = metatype
    } else if (isCtorNotEqual) {
      // when "entity" is a primitive value, we have to temporarily
      // replace the entity to perform the validation against the original
      // metatype defined inside the handler
      entity = { constructor: metatype }
    }

    const errors = await classValidator.validate(entity, this.validatorOptions)
    if (errors.length > 0) {
      throw this.exceptionFactory(errors)
    }
    if (isPrimitive) {
      // if the value is a primitive value and the validation process has been successfully completed
      // we have to revert the original value passed through the pipe
      entity = originalEntity
    }
    if (this.isTransformEnabled) {
      return entity
    }
    if (isNil) {
      // if the value was originally undefined or null, revert it back
      return originalValue
    }
    return Object.keys(this.validatorOptions).length > 0
      ? classTransformer.classToPlain(entity, this.transformOptions)
      : value
  }

  private toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata
    if (type === 'custom' && !this.validateCustomDecorators) {
      return false
    }
    const types = [String, Boolean, Number, Array, Object]
    return !types.some((t) => metatype === t) && !isNil(metatype)
  }

  private toEmptyIfNil<T = any, R = any>(value: T): R | {} {
    return isNil(value) ? {} : value
  }

  private stripProtoKeys(value: Record<string, any>) {
    delete value.__proto__
    const keys = Object.keys(value)
    keys
      .filter((key) => typeof value[key] === 'object' && value[key])
      .forEach((key) => this.stripProtoKeys(value[key]))
  }

  private isPrimitive(value: unknown): boolean {
    return ['number', 'boolean', 'string'].includes(typeof value)
  }
}
