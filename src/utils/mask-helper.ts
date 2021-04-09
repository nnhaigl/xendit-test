import * as _ from 'lodash'
import { MASK_CHARS, WHITE_LIST_HEADERS, WHITE_LIST_BODY } from '../../common'
import { ILoggingOptions } from '../interfaces'
import { LoggingOptions } from '../dtos'
import { isObject, isString } from '../../utils'

export class MaskHelper {
  static mask(data: any, properties: string[]): any {
    if (!data || !properties || properties.length === 0) return data
    const cloned = JSON.parse(JSON.stringify(data))
    properties.forEach(property => {
      MaskHelper.maskDeep(cloned, property, MASK_CHARS)
    })
    return cloned
  }

  private static maskDeep(object: object, path: string, value: any) {
    if (_.isArray(object)) {
      _.forEach(object, item => MaskHelper.maskDeep(item, path, value))
    } else {
      if (path.indexOf('[].') !== -1) {
        const parts = path.split('[].', 1)
        if (parts && parts.length > 0) {
          const tmpPath = parts[0]
          const remainPath = path.substring(tmpPath.length + 3)
          const sub = _.get(object, tmpPath)
          if (!sub) return
          MaskHelper.maskDeep(sub, remainPath, value)
        }
      } else {
        if (_.has(object, path)) {
          _.set(object, path, value)
        }
      }
    }
  }

  static whiteListDeep(data: ILoggingOptions | ILoggingOptions[]): any {
    if (data == null) return null
    if (Array.isArray(data)) {
      return data.map(item => this.toLogging(item))
    }
    return this.toLogging(data)
  }

  private static toLogging(item: ILoggingOptions): any {
    if (isString(item)) return MASK_CHARS
    if (item == null || !isObject(item)) return item
    if (item instanceof Date) {
      return item.toISOString()
    }
    const loggingOptions = _.isFunction(item.loggingOptions)
      ? item.loggingOptions()
      : new LoggingOptions()
    return _.reduce(
      item,
      (result, value, key) => {
        if (WHITE_LIST_BODY.includes(key)) {
          result[key] = value
        } else {
          result[key] = loggingOptions.whiteListProperties.includes(key)
            ? this.whiteListDeep(value)
            : MASK_CHARS
        }
        return result
      },
      {},
    )
  }

  static whiteList(data: any, whiteListProperties: string[] = []): any {
    return _.reduce(
      data,
      (result, value, key) => {
        result[key] =
          whiteListProperties
            .map(prop => prop.toLowerCase())
            .indexOf(key.toLowerCase()) !== -1
            ? value
            : MASK_CHARS
        return result
      },
      {},
    )
  }
}
