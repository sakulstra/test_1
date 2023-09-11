import { ethers } from 'ethers';
import { produce } from 'immer';

import { StoreSlice } from '../../../lib/web3/src';
import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export type RepresentationDataItem = {
  representative: string;
  represented: string[];
};

export type RepresentationFormData = {
  chainId: number;
  representative: string;
  represented: string;
};

export interface IRepresentationsSlice {
  representationAddressLoading: boolean;
  representingAddress: Record<number, string>;
  getRepresentingAddress: () => void;
  setRepresentingAddress: (address: string, chainId: number) => void;

  representationData: Record<number, RepresentationDataItem>;
  getRepresentationData: () => Promise<void>;
  updateRepresentatives: (
    formData: RepresentationFormData[],
    timestamp: number,
  ) => Promise<void>;
}

export const createRepresentationsSlice: StoreSlice<
  IRepresentationsSlice,
  IWeb3Slice & TransactionsSlice & IProposalsSlice & IUISlice
> = (set, get) => ({
  representationAddressLoading: true,
  representingAddress: {},
  getRepresentingAddress: async () => {
    set({ representationAddressLoading: true });

    const activeAddress = get().activeWallet?.accounts[0];
    const addresses = localStorage.getItem('representingAddresses');
    const data = get().representationData;

    if (activeAddress && !!Object.keys(data).length) {
      const addressesObject = !!addresses ? JSON.parse(addresses) : {};
      const walletAddresses: Record<number, string> = addressesObject[
        activeAddress
      ] as Record<number, string>;

      const allAvailableAddresses = Object.values(data)
        .map((data) => data.represented)
        .flat();
      const allStorageAddresses = walletAddresses
        ? Object.values(walletAddresses)
        : [];

      const validAddresses: string[] = [];
      for (let i = 0; i < allAvailableAddresses.length; i++) {
        let found = false;
        for (let j = 0; j < allStorageAddresses.length; j++) {
          if (allAvailableAddresses[i] === allStorageAddresses[j]) {
            found = true;
            break;
          }
        }

        if (!found) {
          validAddresses.push(allAvailableAddresses[i]);
        }
      }

      const isAddressesValid = !!validAddresses.length; // TODO: need make better check by chainId
      set({
        representingAddress: isAddressesValid ? walletAddresses || {} : {},
        representationAddressLoading: false,
      });
    }
  },
  setRepresentingAddress: (address, chainId) => {
    const activeAddress = get().activeWallet?.accounts[0];
    const formattedAddress = !address ? '' : address;
    set((state) =>
      produce(state, (draft) => {
        draft.representingAddress[chainId] = formattedAddress;
      }),
    );
    const addresses = localStorage.getItem('representingAddresses');
    if (addresses && activeAddress) {
      const addressesObject = JSON.parse(addresses);
      const stringifiedAddresses = JSON.stringify({
        ...addressesObject,
        [activeAddress]: { [chainId]: formattedAddress },
      });
      localStorage.setItem('representingAddresses', stringifiedAddresses);
    } else if (activeAddress) {
      const stringifiedAddresses = JSON.stringify({
        [activeAddress]: { [chainId]: formattedAddress },
      });
      localStorage.setItem('representingAddresses', stringifiedAddresses);
    }
  },

  representationData: {},
  getRepresentationData: async () => {
    const activeAddress = get().activeWallet?.accounts[0];

    if (activeAddress) {
      await Promise.all(
        appConfig.votingMachineChainIds.map(async (chainId) => {
          const data = await get().govDataService.getRepresentationData(
            activeAddress,
            chainId,
          );

          const representative = data[chainId].representative;
          const formattedRepresentative =
            representative === ethers.constants.AddressZero ||
            representative === activeAddress
              ? ''
              : representative;

          set((state) =>
            produce(state, (draft) => {
              draft.representationData[chainId] = {
                representative: formattedRepresentative,
                represented: data[chainId].represented,
              };
            }),
          );
        }),
      );
    } else {
      set({ representationAddressLoading: false });
    }
  },

  updateRepresentatives: async (formData, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().getActiveAddress();

    if (activeAddress) {
      const formattedData = formData.map((item) => {
        return {
          representative:
            item.representative === undefined ||
            item.representative === '' ||
            item.representative === activeAddress
              ? ethers.constants.AddressZero
              : item.representative,
          chainId: item.chainId,
        };
      });

      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.updateRepresentatives({ data: formattedData });
        },
        params: {
          type: 'representations',
          desiredChainID: appConfig.govCoreChainId,
          payload: { data: formData, timestamp },
        },
      });
    }
  },
});
