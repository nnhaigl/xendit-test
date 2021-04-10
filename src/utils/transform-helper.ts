import { Type } from '../interfaces'
import { plainToClass, deserialize } from 'class-transformer'

export class TransformHelper {
  static transform<T>(obj: any, classType: Type<T>): any {
    if (typeof obj === 'string') {
      return this.tryDeserialize(classType, obj)
    } else if (obj instanceof Array) {
      return plainToClass(classType, obj)
    } else if (typeof obj === 'object') {
      return plainToClass(classType, obj)
    }
    return null
  }
  private static tryDeserialize<T>(classType: Type<T>, s: string): T | string {
    if (!s || s.trim().length === 0) return null
    return deserialize(classType, s)
  }
}
