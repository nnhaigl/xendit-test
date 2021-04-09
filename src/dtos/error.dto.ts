export class ErrorDto {
  constructor(
    messageKey: string,
    message: string,
    messageValues?: Array<{ [key: string]: any }>,
    errorCode?: number,
  ) {
    this.errorCode = errorCode
    this.messageKey = messageKey
    this.messageValues = messageValues
    this.message = message
  }

  errorCode?: number
  messageKey: string
  message: string
  messageValues?: Array<{ [key: string]: any }>
}
