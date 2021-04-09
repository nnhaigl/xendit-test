export interface ValidatorOptions {
  skipUndefinedProperties?: boolean
  skipNullProperties?: boolean
  skipMissingProperties?: boolean
  whitelist?: boolean
  forbidNonWhitelisted?: boolean
  groups?: string[]
  dismissDefaultMessages?: boolean
  validationError?: {
    target?: boolean
    value?: boolean
  }
  forbidUnknownValues?: boolean
}
