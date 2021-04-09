import * as winston from 'winston'
import { LogDto } from '../dtos/log.dto'
import { ILoggerService } from '../interfaces'
import { isObject } from '../../utils'
import moment from 'moment'

export class LoggerService implements ILoggerService {
  private level: string = 'info'
  private correlationId: string
  public logger: winston.Logger
  constructor(options?: { level: string; correlationId?: string }) {
    if (options) {
      this.level = options.level
      this.correlationId = options.correlationId
    }

    this.logger = winston.createLogger({
      level: this.level,
      format: winston.format.printf(({ message }) => message),
      transports: [new winston.transports.Console({ level: this.level })],
    })
  }

  getCorrelationId(): string {
    return this.correlationId
  }

  isDebugEnabled(): boolean {
    return this.logger.levels[this.level] >= this.logger.levels['debug']
  }

  error(message: any, context?: any): void {
    this.write('error', message, context)
  }

  warn(message: any, context?: any): void {
    this.write('warn', message, context)
  }

  log(message: any, context?: any): void {
    this.write('info', message, context)
  }

  verbose(message: any, context?: any): void {
    this.write('verbose', message, context)
  }

  debug(message: any, context?: any): void {
    this.write('debug', message, context)
  }

  write(level, message: any, context?: any): void {
    // const localeStringOptions = {
    //   year: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   day: '2-digit',
    //   month: '2-digit',
    // }
    // const timestamp = new Date(Date.now()).toLocaleString(
    //   undefined,
    //   localeStringOptions,
    // )
    const log = new LogDto()
    log.time = moment().toISOString()
    log.message = this.format(message)
    log.level = level
    if (this.correlationId) {
      log.correlationId = this.correlationId
    }
    log.context = this.format(context)
    this.logger.log(level, JSON.stringify(log))
  }

  private format(message: any) {
    if (message instanceof Error) {
      return {
        name: message.name,
        message: message.message,
        stack: message.stack,
      }
    }
    return isObject(message) ? message : { detail: message }
  }
}
