export interface ClassTransformOptions {
  strategy?: 'excludeAll' | 'exposeAll'
  groups?: string[]
  version?: number
  excludePrefixes?: string[]
  ignoreDecorators?: boolean
  targetMaps?: any[]
  enableCircularCheck?: boolean
  enableImplicitConversion?: boolean
  excludeExtraneousValues?: boolean
}
