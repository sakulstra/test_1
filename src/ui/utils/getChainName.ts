import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/chains';

export function getChainName(chainId: number) {
  return chainInfoHelper.getChainParameters(chainId || appConfig.govCoreChainId)
    .chainName;
}
