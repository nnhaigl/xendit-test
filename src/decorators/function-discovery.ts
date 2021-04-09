import { DiscoveryOptions, HandlerMetadata } from '../dtos'
import { MetadataScanner } from './metadata-scanner'
// import { FeatureToggleFilter } from './feature-toggle-filter'

export class FunctionDiscovery {
  static async scan(
    handlerCls: new (...args) => any,
    options?: DiscoveryOptions,
  ): Promise<HandlerMetadata> {
    if (!handlerCls) throw new Error(`Handler is required`)

    const handlerMeta = MetadataScanner.getHandlerMetadatas(handlerCls)
    return handlerMeta
  }
}
