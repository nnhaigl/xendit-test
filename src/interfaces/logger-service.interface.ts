export interface ILoggerService {
  log(message: any, context?: any): any
  error(message: any, trace?: any, context?: any): any
  warn(message: any, context?: any): any
  debug?(message: any, context?: any): any
  verbose?(message: any, context?: any): any
  isDebugEnabled?(): boolean
  getCorrelationId?(): string
}
