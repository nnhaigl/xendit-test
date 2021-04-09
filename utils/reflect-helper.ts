export class ReflectHelper {
  public static getMetadata(key: string, target: object) {
    return Reflect.getMetadata(key, target)
  }

  public static getDesignType(key: string, target: object) {
    return Reflect.getMetadata('design:type', target, key)
  }

  public static getDesignParameters(key: string, target: object) {
    return Reflect.getMetadata('design:paramtypes', target, key)
  }

  public static extendArrayMetadata<T extends Array<any>>(
    key: string,
    metadata: T,
    target,
  ) {
    const previousValue = Reflect.getMetadata(key, target) || []
    const value = [...previousValue, ...metadata]
    Reflect.defineMetadata(key, value, target)
  }
}
