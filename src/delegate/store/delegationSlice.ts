import { constants } from 'ethers';

import { normalizeBN } from '../../../lib/helpers/src';
import { IERC20__factory } from '../../../lib/helpers/src/contracts/IERC20/IERC20__factory';
import { StoreSlice } from '../../../lib/web3/src';
import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { getTokenName, Token } from '../../utils/getTokenName';
import {
  BatchMetaDelegateParams,
  GovernancePowerTypeApp,
} from '../../web3/services/delegationService';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { DelegateData, DelegateItem } from '../types';

export interface IDelegationSlice {
  delegateData: DelegateItem[];
  getDelegateData: () => Promise<void>;
  delegate: (formDelegateData: DelegateData[]) => Promise<void>;
}

export const createDelegationSlice: StoreSlice<
  IDelegationSlice,
  IWeb3Slice & TransactionsSlice & IProposalsSlice & IUISlice
> = (set, get) => ({
  delegateData: [],
  getDelegateData: async () => {
    const activeAddress = get().getActiveAddress();

    if (activeAddress) {
      const votingStrategy =
        await get().govDataService.getVotingStrategyContract();
      const underlyingAssets = await votingStrategy.getVotingAssetList();

      const delegateData = await Promise.all(
        underlyingAssets.map(async (underlyingAsset) => {
          const erc20 = IERC20__factory.connect(
            underlyingAsset,
            appConfig.providers[appConfig.govCoreChainId],
          );
          const symbol = getTokenName(underlyingAsset) as Token;
          const balance = await erc20.balanceOf(activeAddress);

          const delegatesAddresses = await get().delegationService.getDelegates(
            underlyingAsset,
            activeAddress,
          );

          const votingToAddress = delegatesAddresses[0];
          const propositionToAddress = delegatesAddresses[1];

          return {
            underlyingAsset,
            symbol,
            amount: normalizeBN(balance.toString(), 18).toNumber(),
            votingToAddress:
              votingToAddress === activeAddress ||
              votingToAddress === constants.AddressZero
                ? ''
                : !!votingToAddress
                ? votingToAddress
                : '',
            propositionToAddress:
              propositionToAddress === activeAddress ||
              propositionToAddress === constants.AddressZero
                ? ''
                : !!propositionToAddress
                ? propositionToAddress
                : '',
          };
        }),
      );

      set({ delegateData });
    } else {
      set({ delegateData: [] });
    }
  },

  delegate: async (formDelegateData) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const delegationService = get().delegationService;
    const activeAddress = get().getActiveAddress();

    if (activeAddress) {
      // initiate batch of signatures
      const sigs: BatchMetaDelegateParams[] = [];

      // iterate over form data to create batch of signatures
      for await (const formDelegateItem of formDelegateData) {
        const { votingToAddress, propositionToAddress, underlyingAsset } =
          formDelegateItem;

        // get previous delegation data for current asset
        const delegateData: DelegateItem = get().delegateData.filter(
          (data) => data.underlyingAsset === underlyingAsset,
        )[0];

        const isAddressSame = votingToAddress === propositionToAddress;
        const isInitialAddressSame =
          delegateData.propositionToAddress === delegateData.votingToAddress;

        const isVotingToAddressSame =
          delegateData.votingToAddress === votingToAddress;
        const isPropositionToAddressSame =
          delegateData.propositionToAddress === propositionToAddress;

        // check if delegationTo is the same address and not equal to previous delegation
        if (
          isAddressSame &&
          (!isInitialAddressSame ||
            votingToAddress !== delegateData.votingToAddress)
        ) {
          const sig = await delegationService.delegateMetaSig(
            underlyingAsset,
            votingToAddress === '' ? activeAddress : votingToAddress,
            GovernancePowerTypeApp.All,
            activeAddress,
          );
          sig && sigs.push(sig);
        } else {
          // if delegationTo are different addresses
          // check if need to re-delegate voting
          if (!isVotingToAddressSame) {
            const sig = await delegationService.delegateMetaSig(
              underlyingAsset,
              votingToAddress === '' ? activeAddress : votingToAddress,
              GovernancePowerTypeApp.VOTING,
              activeAddress,
            );
            sig && sigs.push(sig);
          }
          // check if need to re-delegate proposition
          if (!isPropositionToAddressSame) {
            const sig = await delegationService.delegateMetaSig(
              underlyingAsset,
              propositionToAddress === ''
                ? activeAddress
                : propositionToAddress,
              GovernancePowerTypeApp.PROPOSITION,
              activeAddress,
              !isVotingToAddressSame && !isPropositionToAddressSame,
            );
            sig && sigs.push(sig);
          }
        }
      }

      if (!!sigs.length) {
        // after we finished gathering signatures, we send it
        await get().executeTx({
          body: () => {
            get().setModalOpen(true);
            return delegationService.batchMetaDelegate(sigs);
          },
          params: {
            type: 'delegate',
            desiredChainID: appConfig.govCoreChainId,
            payload: { delegateData: get().delegateData, formDelegateData },
          },
        });
      }
    }
  },
});
