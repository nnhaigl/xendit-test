import { ValidationError } from 'class-validator'
import { COMMON_LIMIT_LEVEL_VALIDATION } from '../../common'

export class ValidationErrorHelper {
  constructor() {}
  private static extractListErrors(obj: ValidationError, level: number) {
    let results = []
    if (!obj || level >= COMMON_LIMIT_LEVEL_VALIDATION) return results
    const { children, constraints, property, value } = obj
    if (constraints) {
      const valueRes = {}
      valueRes[property] = value
      results.push({ constraints, valueRes })
    }
    if (children && children.length > 0) {
      children.forEach(item => {
        const childConstraints = this.extractListErrors(item, level + 1)
        results = [...results, ...childConstraints]
      })
    }
    return results
  }
  private static joinMessagesInConstraint(constraint: any): string {
    const results = Object.entries<string>(constraint).reduce(
      (result, [key, value]) => {
        return result ? `${result}. ${value}` : value
      },
      '',
    )
    return results
  }
  private static getMessagesFromListErrors(
    errors: any[],
  ): { inlineMsg: string; valueRes: object } {
    let valueRes = {}
    const inlineMsg = Object.entries<{
      constraints: object[]
      valueRes: object
    }>(errors).reduce((result, [key, itemValue]) => {
      valueRes = Object.assign(valueRes, itemValue.valueRes)
      const message = this.joinMessagesInConstraint(itemValue.constraints)
      return result ? `${result}. ${message}` : message
    }, '')
    return {
      inlineMsg,
      valueRes,
    }
  }
  public static parseValidationMessage(
    rawMessages: Array<ValidationError>,
  ): { Message: string; MessageValues: Array<any> } {
    const { property } = rawMessages[0]
    const listErrors = this.extractListErrors(rawMessages[0], 0)
    const { inlineMsg, valueRes } = this.getMessagesFromListErrors(listErrors)
    return {
      Message: inlineMsg,
      MessageValues: [{ value: valueRes, property }],
    }
  }
}
