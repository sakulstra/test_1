import {
  appConfigInit,
  ChainIdByName,
  CoreNetworkName,
  payloadsControllerChainIds,
  votingMachineChainIds,
} from '../../lib/helpers/src';
import { StaticJsonRpcBatchProvider } from '../../lib/web3/src/utils/StaticJsonRpcBatchProvider';
import { chainInfoHelper } from './chains';

export const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';

export const coreName: CoreNetworkName = 'goerli';
export const WC_PROJECT_ID = 'e6ed0c48443e54cc875462bbaec6e3a7'; // https://docs.walletconnect.com/2.0/cloud/relay

const appUsedNetworks: ChainIdByName[] = [
  ...votingMachineChainIds[coreName],
  ...payloadsControllerChainIds[coreName],
].filter((value, index, self) => self.indexOf(value) === index);

const providers: Record<number, StaticJsonRpcBatchProvider> = {};
appUsedNetworks.forEach((element) => {
  providers[element] = chainInfoHelper.providerInstances[element].instance;
});

export const appConfig = appConfigInit(providers, coreName);
