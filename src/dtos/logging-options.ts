export class LoggingOptions {
  constructor(public whiteListProperties: string[] = []) {
    this.whiteListProperties =
      whiteListProperties != null && Array.isArray(whiteListProperties)
        ? whiteListProperties
        : []
  }
}
