import { Paramtype } from './paramtype.interface'
import { Type } from './type.interface'

export type Transform<T = any> = (value: T, metadata: ArgumentMetadata) => any

export interface ArgumentMetadata {
  readonly type: Paramtype
  readonly metatype?: Type<any> | undefined
  readonly options?: string | undefined
}

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R
}
