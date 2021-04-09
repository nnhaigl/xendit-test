import { isString, isObject } from '../../utils'

export class HttpException extends Error {
  public readonly message: any
  constructor(
    private readonly response: string | object,
    private readonly status: number,
  ) {
    super()
    this.message = response
  }

  public getResponse(): string | object {
    return this.response
  }

  public getStatus(): number {
    return this.status
  }

  public toString(): string {
    const message = this.getErrorString(this.message)
    return `Error: ${message}`
  }

  private getErrorString(target: string | object): string {
    return isString(target) ? target : JSON.stringify(target)
  }

  public static createBody(
    message: object | string,
    error?: string,
    statusCode?: number,
  ) {
    if (!message) {
      return { statusCode, error }
    }
    return isObject(message) && !Array.isArray(message)
      ? message
      : { statusCode, error, message }
  }
}
