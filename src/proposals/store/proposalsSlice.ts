import { produce } from 'immer';

import {
  Balance,
  BasicProposal,
  checkHash,
  ContractsConstants,
  getProposalMetadata,
  getProposalStepsAndAmounts,
  getVotingMachineProposalState,
  InitialPayload,
  ipfsGateway,
  normalizeBN,
  Payload,
  PayloadAction,
  ProposalData,
  ProposalMetadata,
  valueToBigNumber,
  VotersData,
  VotingBalance,
  VotingConfig,
} from '../../../lib/helpers/src';
import { IWalletSlice, StoreSlice } from '../../../lib/web3/src';
import { IDelegationSlice } from '../../delegate/store/delegationSlice';
import { IRepresentationsSlice } from '../../representations/store/representationsSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { generateProofsRepresentativeByChain } from '../../web3/utils/helperToGetProofs';
import {
  formatBalances,
  getVotingAssetsWithSlot,
  getVotingProofs,
} from '../utils/formatBalances';
import { IProposalsHistorySlice } from './proposalsHistorySlice';
import { IProposalsListCacheSlice } from './proposalsListCacheSlice';
import {
  getProposalTitle,
  selectConfigByAccessLevel,
  selectPaginatedIds,
  selectProposalIds,
} from './proposalsSelectors';

export interface IProposalsSlice {
  isInitialLoading: boolean;

  totalProposalCount: number;
  totalProposalCountLoading: boolean;
  getTotalProposalCount: (internal?: boolean) => Promise<void>;
  setTotalProposalCount: (value: number) => void;

  totalPayloadsCount: Record<string, number>;
  initialPayloadsCount: Record<string, number>;
  getTotalPayloadsCount: () => Promise<void>;

  filteredState: number | null;
  setFilteredState: (value: number | null) => void;

  titleSearchValue: string | undefined;
  setTitleSearchValue: (value: string | undefined) => void;

  activePage: number;
  setActivePage: (activePage: number) => void;
  getPaginatedProposalsData: () => Promise<void>;
  updatePaginatedProposalsData: () => void;
  getProposalDataWithIpfsById: (id: number) => Promise<void>;

  setGovCoreConfigs: () => Promise<void>;
  setSSRGovCoreConfigs: (
    configs: VotingConfig[],
    contractsConstants: ContractsConstants,
  ) => void;
  configs: VotingConfig[];
  contractsConstants: ContractsConstants;

  detailedPayloadsData: Record<string, Payload>;
  setDetailedPayloadsData: (key: string, data: Payload) => void;
  getDetailedPayloadsData: (
    chainId: number,
    payloadsController: string,
    ids: number[],
  ) => Promise<void>;

  ipfsData: Record<string, ProposalMetadata>;
  ipfsDataErrors: Record<string, string>;
  setIpfsDataErrors: (ipfsHash: string, text?: string) => void;
  setIpfsData: (hash: string, data: ProposalMetadata) => void;
  getIpfsData: (ids: number[]) => Promise<void>;

  detailedProposalsData: Record<number, ProposalData>;
  detailedProposalsDataLoading: boolean;
  setDetailedProposalsData: (id: number, data: ProposalData) => void;
  getDetailedProposalsData: (
    ids: number[],
    from?: number,
    to?: number,
    pageSize?: number,
  ) => void;
  detailedProposalDataInterval: number | undefined;
  startDetailedProposalDataPolling: (ids?: number[]) => Promise<void>;
  stopDetailedProposalDataPolling: () => void;

  newProposalsInterval: number | undefined;
  startNewProposalsPolling: () => Promise<void>;
  stopNewProposalsPolling: () => void;

  blockHashBalance: VotingBalance;
  resetL1Balances: () => void;
  getL1Balances: (ids: number[]) => Promise<void>;

  creatorBalance: Record<string, number>;
  getProposalCreatorBalance: (
    creator: string,
    underlyingAssets: string[],
  ) => Promise<void>;

  voters: VotersData[];
  setVoters: (voters: VotersData[]) => void;
  getVoters: (
    votingChainId: number,
    startBlockNumber: number,
    endBlockNumber: number,
    lastBlockNumber: number,
  ) => Promise<void>;
  getVotersInterval: number | undefined;
  startVotersPolling: (
    votingChainId: number,
    startBlockNumber: number,
    endBlockNumber: number,
    lastBlockNumber: number,
  ) => Promise<void>;
  stopVotersPolling: () => void;

  supportObject: Record<number, boolean>;
  fullClearSupportObject: () => void;
  clearSupportObject: (proposalId: number) => void;
  setSupportObject: (proposalId: number, support: boolean) => void;

  activateVoting: (proposalId: number) => Promise<void>;
  sendProofs: (
    votingChainId: number,
    proposalId: number,
    asset: string,
    baseBalanceSlotRaw: number,
    withSlot?: boolean,
  ) => Promise<void>;
  activateVotingOnVotingMachine: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  vote: (params: {
    votingChainId: number;
    proposalId: number;
    support: boolean;
    balances: Balance[];
    gelato?: boolean;
    voterAddress?: string;
  }) => Promise<void>;
  closeAndSendVote: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  executeProposal: (proposalId: number) => Promise<void>;
  executePayload: (
    proposalId: number,
    payload: InitialPayload,
  ) => Promise<void>;

  createPayload: (
    chainId: number,
    payloadActions: PayloadAction[],
    payloadId: number,
    payloadsController: string,
  ) => Promise<void>;
  createProposal: (
    votingPortalAddress: string,
    payloads: InitialPayload[],
    ipfsHash: string,
  ) => Promise<void>;

  cancelProposal: (proposalId: number) => Promise<void>;
}

export const createProposalsSlice: StoreSlice<
  IProposalsSlice,
  IProposalsListCacheSlice &
    IWeb3Slice &
    TransactionsSlice &
    IWalletSlice &
    IDelegationSlice &
    IUISlice &
    IProposalsHistorySlice &
    IRepresentationsSlice
> = (set, get) => ({
  isInitialLoading: true,

  totalProposalCount: -1,
  totalProposalCountLoading: false,
  getTotalProposalCount: async (internal) => {
    await set({ totalProposalCountLoading: true });
    const totalProposalCount =
      await get().govDataService.getTotalProposalsCount();
    await set({ totalProposalCount, totalProposalCountLoading: false });
    if (internal) {
      set({ isInitialLoading: false });
    }
  },
  setTotalProposalCount: (value) => {
    if (value > get().totalProposalCount) {
      set({ totalProposalCount: value });
    }
  },

  totalPayloadsCount: {},
  initialPayloadsCount: {},
  getTotalPayloadsCount: async () => {
    await Promise.all(
      appConfig.payloadsControllerChainIds.map(async (chainId) => {
        await Promise.all(
          appConfig.payloadsControllerConfig[chainId].contractAddresses.map(
            async (payloadsController) => {
              const totalPayloadsCount =
                await get().govDataService.getTotalPayloadsCount(
                  payloadsController,
                  chainId,
                );

              set({
                totalPayloadsCount: {
                  ...get().totalPayloadsCount,
                  [payloadsController]: totalPayloadsCount,
                },
                initialPayloadsCount: {
                  ...get().initialPayloadsCount,
                  [payloadsController]: totalPayloadsCount,
                },
              });
            },
          ),
        );
      }),
    );
  },

  filteredState: null,
  setFilteredState: (value) => {
    set({ filteredState: value });
  },

  titleSearchValue: undefined,
  setTitleSearchValue: (value) => {
    if (!!value) {
      set({ titleSearchValue: value });
    } else {
      set({ titleSearchValue: undefined });
    }
  },

  activePage: 0,
  setActivePage: (activePage: number) => {
    set({ activePage: activePage });
  },

  getPaginatedProposalsData: async () => {
    if (get().isInitialLoading) {
      await get().getTotalProposalCount();
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);
      await get().getDetailedProposalsData(activeIds);
      if (!!activeIds.length) {
        await Promise.all([
          await get().getIpfsData(activeIds),
          await get().getL1Balances(activeIds),
        ]);
      }
      set({ isInitialLoading: false });
      get().updatePaginatedProposalsData();
    } else {
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);
      await get().getDetailedProposalsData(activeIds);
      await Promise.all([
        await get().getIpfsData(activeIds),
        await get().getL1Balances(activeIds),
      ]);
      get().updatePaginatedProposalsData();
    }
  },
  updatePaginatedProposalsData: () => {
    const paginatedIds = selectPaginatedIds(get());
    const { activeIds, cachedIds } = selectProposalIds(get(), paginatedIds);

    set((state) =>
      produce(state, (draft) => {
        activeIds.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(get(), id, proposalData.ipfsHash),
            };
          }
        });
        cachedIds.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(get(), id, proposalData.ipfsHash),
              prerender: true,
            };
          }
        });
      }),
    );
  },
  getProposalDataWithIpfsById: async (id) => {
    await get().getDetailedProposalsData([id]);
    await Promise.all([
      await get().getIpfsData([id]),
      await get().getL1Balances([id]),
    ]);
    get().updatePaginatedProposalsData();
  },

  setGovCoreConfigs: async () => {
    if (!get().configs.length) {
      const { configs, contractsConstants } =
        await get().govDataService.getGovCoreConfigs();
      set({ configs, contractsConstants });
    }
  },
  setSSRGovCoreConfigs: (configs, contractsConstants) => {
    if (!get().configs.length) {
      set({ configs, contractsConstants });
    }
  },
  configs: [],
  contractsConstants: {
    precisionDivider: '',
    cooldownPeriod: 0,
    expirationTime: 0,
    cancellationFee: '',
  },

  detailedPayloadsData: {},
  setDetailedPayloadsData: (key, data) => {
    if (!get().detailedPayloadsData[key]) {
      set((state) =>
        produce(state, (draft) => {
          draft.detailedPayloadsData[key] = data;
        }),
      );
    }
  },
  getDetailedPayloadsData: async (chainId, payloadsController, ids) => {
    const payloadController =
      appConfig.payloadsControllerConfig[chainId].contractAddresses.some(
        (address) => address === payloadsController,
      ) && payloadsController;

    if (payloadController) {
      const payloadsData = await get().govDataService.getPayloads(
        chainId,
        payloadsController,
        ids,
      );

      set((state) =>
        produce(state, (draft) => {
          payloadsData.forEach((payload) => {
            draft.detailedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ] = payload;
          });
        }),
      );
    }
  },

  ipfsData: {},
  ipfsDataErrors: {},
  setIpfsDataErrors: (ipfsHash, text) => {
    set((state) =>
      produce(state, (draft) => {
        draft.ipfsDataErrors[ipfsHash] = text || texts.other.fetchFromIpfsError;
      }),
    );
  },
  setIpfsData: (hash, data) => {
    if (!get().ipfsData[hash]) {
      set((state) =>
        produce(state, (draft) => {
          draft.ipfsData[hash] = data;
        }),
      );
    }
  },
  getIpfsData: async (ids) => {
    const ipfsData = get().ipfsData;

    const newIpfsHashes: string[] = [];
    ids.forEach((id) => {
      const proposalData = get().detailedProposalsData[id];

      if (
        proposalData &&
        typeof ipfsData[proposalData.ipfsHash] === 'undefined'
      ) {
        newIpfsHashes.push(proposalData.ipfsHash);
      }
    });

    const filteredNewIpfsHashes = newIpfsHashes.filter(
      (value, index, self) => self.indexOf(value) === index,
    );

    const allIpfsData = await Promise.all(
      filteredNewIpfsHashes.map(async (hash) => {
        return await getProposalMetadata(
          hash,
          ipfsGateway,
          get().setIpfsDataErrors,
          texts.other.fetchFromIpfsIncorrectHash,
        );
      }),
    );

    set((state) =>
      produce(state, (draft) => {
        allIpfsData.forEach((ipfs, index) => {
          draft.ipfsData[filteredNewIpfsHashes[index]] = ipfs;
        });
        ids.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(
                get(),
                id,
                proposalData.ipfsHash,
                draft.detailedProposalsData[id]?.title,
              ),
            };
          }
        });
      }),
    );
  },

  detailedProposalsData: {},
  detailedProposalsDataLoading: false,
  setDetailedProposalsData: (id, data) => {
    if (!get().detailedProposalsData[id]) {
      set({ detailedProposalsDataLoading: true });
      set((state) =>
        produce(state, (draft) => {
          draft.detailedProposalsData[id] = data;
        }),
      );
      set({ detailedProposalsDataLoading: false });
    }
  },

  getDetailedProposalsData: async (ids, from, to, pageSize) => {
    const userAddress = get().getActiveAddress();
    const representativeAddress = get().representingAddress;

    if (!get().representationAddressLoading) {
      const isProposalNotInCache = !ids.filter(
        (proposalId) =>
          proposalId ===
          get().cachedProposalsIds.find((id) => proposalId === id),
      ).length;

      let proposalsData: BasicProposal[] = [];
      if (!!ids.length && isProposalNotInCache) {
        const fr = Math.max.apply(
          null,
          ids.map((id) => id),
        );

        const to = Math.min.apply(
          null,
          ids.map((id) => id),
        );

        proposalsData = await get().govDataService.getDetailedProposalsData(
          fr <= 0 ? (get().totalProposalCount > 9 ? 1 : 0) : fr,
          to <= 0 ? 0 : to,
          userAddress,
          representativeAddress,
        );
      } else if ((from || from === 0 || from === -1) && isProposalNotInCache) {
        proposalsData = await get().govDataService.getDetailedProposalsData(
          from < 0 ? 0 : from,
          0,
          userAddress,
          representativeAddress,
          pageSize,
        );
      } else if (from && from > 0 && to && to > 0 && isProposalNotInCache) {
        proposalsData = await get().govDataService.getDetailedProposalsData(
          from,
          to,
          userAddress,
          representativeAddress,
        );
      } else if (!isProposalNotInCache) {
        const proposals = ids.map((id) => get().detailedProposalsData[id]);
        proposalsData = await get().govDataService.getOnlyVotingMachineData(
          proposals,
          userAddress,
          representativeAddress,
        );
      }

      const payloadsChainIds = proposalsData
        .map((proposal) =>
          proposal.initialPayloads.map((payload) => payload.chainId),
        )
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      const payloadsControllers = proposalsData
        .map((proposal) =>
          proposal.initialPayloads.map((payload) => payload.payloadsController),
        )
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      await Promise.all(
        payloadsChainIds.map(async (chainId) => {
          await Promise.all(
            payloadsControllers.map(async (controller) => {
              const payloadsIds = proposalsData
                .map((proposal) =>
                  proposal.initialPayloads.filter(
                    (payload) =>
                      payload.chainId === chainId &&
                      payload.payloadsController === controller,
                  ),
                )
                .flat()
                .map((payload) => payload.id);

              if (isProposalNotInCache) {
                await get().getDetailedPayloadsData(
                  chainId,
                  controller,
                  payloadsIds,
                );
              }
            }),
          );
        }),
      );

      const proposalPayloadsData = proposalsData.map((proposal) => {
        const payloads = proposal.initialPayloads.map((payload) => {
          return {
            ...get().detailedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ],
            id: payload.id,
            chainId: payload.chainId,
            payloadsController: payload.payloadsController,
          };
        });

        return {
          proposalId: proposal.id,
          payloads,
        };
      });

      set((state) =>
        produce(state, (draft) => {
          proposalsData.forEach((proposal) => {
            draft.detailedProposalsData[proposal.id] = {
              ...proposal,
              prerender: !draft.detailedProposalsData[proposal.id]?.prerender
                ? proposal.prerender
                : !!draft.detailedProposalsData[proposal.id]?.prerender,
              votingMachineState: getVotingMachineProposalState(proposal),
              payloads: !!draft.detailedProposalsData[proposal.id]?.prerender
                ? draft.detailedProposalsData[proposal.id].payloads
                : proposalPayloadsData.filter(
                    (payload) => payload.proposalId === proposal.id,
                  )[0].payloads,
              title: getProposalTitle(
                get(),
                proposal.id,
                proposal.ipfsHash,
                draft.detailedProposalsData[proposal.id]?.title,
              ),
            };
          });
        }),
      );
    }
  },
  detailedProposalDataInterval: undefined,
  startDetailedProposalDataPolling: async (ids) => {
    const currentInterval = get().detailedProposalDataInterval;
    clearInterval(currentInterval);

    const interval = setInterval(async () => {
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);

      const activeProposalsIds = !!ids?.length ? ids : activeIds;

      if (!!activeProposalsIds.length) {
        await get().getDetailedProposalsData(activeProposalsIds);
        await Promise.all([
          await get().getIpfsData(activeProposalsIds),
          await get().getL1Balances(activeProposalsIds),
        ]);
        get().updatePaginatedProposalsData();
      }
    }, 30000);

    set({ detailedProposalDataInterval: Number(interval) });
  },
  stopDetailedProposalDataPolling: () => {
    const interval = get().detailedProposalDataInterval;
    if (interval) {
      clearInterval(interval);
      set({ detailedProposalDataInterval: undefined });
    }
  },

  newProposalsInterval: undefined,
  startNewProposalsPolling: async () => {
    const currentInterval = get().newProposalsInterval;
    clearInterval(currentInterval);

    const interval = setInterval(async () => {
      const totalProposalCountFromContract =
        await get().govDataService.getTotalProposalsCount();
      const currentProposalCount = get().totalProposalCount;

      if (totalProposalCountFromContract > currentProposalCount) {
        get().getDetailedProposalsData(
          [],
          currentProposalCount,
          currentProposalCount - 1,
        );
        get().setTotalProposalCount(totalProposalCountFromContract);
      }
    }, 15000);

    set({ newProposalsInterval: Number(interval) });
  },
  stopNewProposalsPolling: () => {
    const interval = get().newProposalsInterval;
    if (interval) {
      clearInterval(interval);
      set({ newProposalsInterval: undefined });
    }
  },

  blockHashBalance: {},
  resetL1Balances: () => {
    set({ blockHashBalance: {} });
  },
  getL1Balances: async (ids) => {
    const activeAddress = get().getActiveAddress();
    const blockHashes = get().blockHashBalance;

    const newBlockHashes: {
      hash: string;
      underlyingAssets: string[];
      votingChainId: number;
    }[] = [];
    ids.forEach((id) => {
      const proposalData = get().detailedProposalsData[id];
      if (
        proposalData &&
        !!proposalData.payloads.length &&
        !!get().configs.length &&
        get().contractsConstants.expirationTime > 0
      ) {
        const proposalConfig = selectConfigByAccessLevel(
          get(),
          proposalData.accessLevel,
        );

        const executionPayloadTime = Math.max.apply(
          null,
          proposalData.payloads.map((payload) => payload.delay),
        );

        const { isVotingActive } = getProposalStepsAndAmounts({
          proposalData,
          quorum: proposalConfig.quorum,
          differential: proposalConfig.differential,
          precisionDivider: get().contractsConstants.precisionDivider,
          cooldownPeriod: get().contractsConstants.cooldownPeriod,
          executionPayloadTime,
        });

        if (
          proposalData &&
          !!proposalData.votingMachineData.l1BlockHash &&
          isVotingActive &&
          typeof blockHashes[proposalData.votingMachineData.l1BlockHash] ===
            'undefined'
        ) {
          newBlockHashes.push({
            hash: proposalData.votingMachineData.l1BlockHash,
            underlyingAssets: proposalData.votingMachineData.votingAssets,
            votingChainId: proposalData.votingChainId,
          });
        }
      }
    });

    if (activeAddress && !get().representationAddressLoading) {
      const balances = await Promise.all(
        newBlockHashes.map((item) => {
          return get().delegationService.getDelegatedVotingPowerByBlockHash(
            item.hash,
            get().representingAddress[item.votingChainId] || activeAddress,
            item.underlyingAssets,
          );
        }),
      );

      set((state) =>
        produce(state, (draft) => {
          balances.forEach((balance, index) => {
            draft.blockHashBalance[newBlockHashes[index].hash] = balance;
          });
        }),
      );
    }
  },

  creatorBalance: {},
  getProposalCreatorBalance: async (creator, underlyingAssets) => {
    const creatorDelegatedPower =
      await get().delegationService.getDelegatedPropositionPower(
        underlyingAssets,
        creator,
      );

    const creatorPropositionPower = creatorDelegatedPower.map((power) =>
      normalizeBN(power.delegationPropositionPower.toString(), 18).toNumber(),
    );

    const creatorBalance = creatorPropositionPower
      .map((balance) => valueToBigNumber(balance).toNumber())
      .reduce((sum, value) => sum + value, 0);

    set((state) =>
      produce(state, (draft) => {
        draft.creatorBalance[creator] = creatorBalance;
      }),
    );
  },

  voters: [],
  setVoters: (voters) => set({ voters }),
  getVoters: async (
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  ) => {
    const votersData = await get().govDataService.getVoters(
      votingChainId,
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
    );
    const currentVotersData = get().voters;

    const newVotersData: VotersData[] = [];
    for (let i = 0; i < votersData.length; i++) {
      let found = false;
      for (let j = 0; j < currentVotersData.length; j++) {
        if (
          votersData[i].transactionHash === currentVotersData[j].transactionHash
        ) {
          found = true;
          break;
        }
      }

      if (!found) {
        newVotersData.push(votersData[i]);
      }
    }

    if (newVotersData.length > 0) {
      set((state) =>
        produce(state, (draft) => {
          draft.voters = [...draft.voters, ...newVotersData];
        }),
      );
    }
  },
  getVotersInterval: undefined,
  startVotersPolling: async (
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  ) => {
    const currentInterval = get().getVotersInterval;
    clearInterval(currentInterval);

    const interval = setInterval(() => {
      get().getVoters(
        votingChainId,
        startBlockNumber,
        endBlockNumber,
        lastBlockNumber,
      );
    }, 60000);

    set({ getVotersInterval: Number(interval) });
  },
  stopVotersPolling: () => {
    const interval = get().getVotersInterval;
    if (interval) {
      clearInterval(interval);
      set(() => ({ getVotersInterval: undefined }));
    }
  },

  supportObject: {},
  fullClearSupportObject: () => {
    set({ supportObject: {} });
  },
  clearSupportObject: (proposalId) => {
    set((state) =>
      produce(state, (draft) => {
        delete draft.supportObject[proposalId];
      }),
    );
  },
  setSupportObject: (proposalId, support) => {
    set((state) =>
      produce(state, (draft) => {
        draft.supportObject[proposalId] = support;
      }),
    );
  },

  activateVoting: async (proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.activateVoting(proposalId);
      },
      params: {
        type: 'activateVoting',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  sendProofs: async (
    votingChainId,
    proposalId,
    asset,
    baseBalanceSlotRaw,
    withSlot,
  ) => {
    const activeAddress = get().getActiveAddress();

    if (activeAddress) {
      const proposalData = get().detailedProposalsData[proposalId];

      if (checkHash(proposalData.snapshotBlockHash).notZero) {
        const block = await appConfig.providers[
          appConfig.govCoreChainId
        ].getBlock(proposalData.snapshotBlockHash);

        await get().executeTx({
          body: () => {
            get().setModalOpen(true);
            return get().govDataService.sendProofs(
              get().representingAddress[votingChainId] || activeAddress,
              block.number,
              asset,
              votingChainId,
              baseBalanceSlotRaw,
              withSlot,
            );
          },
          params: {
            type: 'sendProofs',
            desiredChainID: votingChainId,
            payload: {
              proposalId,
              blockHash: proposalData.snapshotBlockHash,
              underlyingAsset: asset,
              withSlot,
            },
          },
        });
      }
    }
  },

  activateVotingOnVotingMachine: async (votingChainId, proposalId) => {
    const govDataService = get().govDataService;
    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.activateVotingOnVotingMachine(
          votingChainId,
          proposalId,
        );
      },
      params: {
        type: 'activateVotingOnVotingMachine',
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  vote: async ({
    votingChainId,
    proposalId,
    support,
    gelato,
    balances,
    voterAddress,
  }) => {
    const activeAddress = get().getActiveAddress();
    const proposal = get().detailedProposalsData[proposalId];
    const govDataService = get().govDataService;

    if (proposal && activeAddress) {
      if (balances && balances.length > 0) {
        const formattedBalances = formatBalances(balances);

        if (voterAddress) {
          const proofs = await getVotingProofs(
            proposal.snapshotBlockHash,
            formattedBalances,
            govDataService,
            voterAddress,
          );

          // console.info(
          //   'balances proofs array',
          //   proofs.map((proof) => proof.proof),
          // );
          //
          // proofs.forEach((proof) => {
          //   console.info('balances', proof.underlyingAsset, '///', proof.proof);
          // });

          if (proofs && proofs.length > 0) {
            const blockNumber = await govDataService.getCoreBlockNumber(
              proposal.snapshotBlockHash,
            );

            const proofOfRepresentative =
              await generateProofsRepresentativeByChain(
                appConfig.providers[appConfig.govCoreChainId],
                appConfig.govCoreConfig.contractAddress,
                9,
                voterAddress,
                votingChainId,
                blockNumber,
              );

            // console.info('proofOfRepresentative', proofOfRepresentative);

            await get().executeTx({
              body: () => {
                get().setModalOpen(true);
                return gelato
                  ? govDataService.voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot:
                        getVotingAssetsWithSlot(formattedBalances),
                      proofs,
                      signerAddress: activeAddress,
                      voterAddress,
                      proofOfRepresentation: proofOfRepresentative,
                    })
                  : govDataService.vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                      voterAddress,
                      proofOfRepresentation: proofOfRepresentative,
                    });
              },
              params: {
                type: 'vote',
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: voterAddress,
                },
              },
            });
          }
        } else {
          const proofs = await getVotingProofs(
            proposal.votingMachineData.l1BlockHash,
            formattedBalances,
            govDataService,
            activeAddress,
          );

          if (proofs && proofs.length > 0) {
            await get().executeTx({
              body: () => {
                get().setModalOpen(true);
                return gelato
                  ? govDataService.voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot:
                        getVotingAssetsWithSlot(formattedBalances),
                      signerAddress: activeAddress,
                      proofs,
                    })
                  : govDataService.vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                    });
              },
              params: {
                type: 'vote',
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: activeAddress,
                },
              },
            });
          }
        }
      }
    }
  },

  closeAndSendVote: async (votingChainId, proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.closeAndSendVote(votingChainId, proposalId);
      },
      params: {
        type: 'closeAndSendVote',
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executeProposal: async (proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.executeProposal(proposalId);
      },
      params: {
        type: 'executeProposal',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executePayload: async (proposalId, payload) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.executePayload(
          payload.chainId,
          payload.id,
          payload.payloadsController,
        );
      },
      params: {
        type: 'executePayload',
        desiredChainID: payload.chainId,
        payload: {
          proposalId,
          payloadId: payload.id,
          chainId: payload.chainId,
        },
      },
    });
  },

  createPayload: async (
    chainId,
    payloadActions,
    payloadId,
    payloadsController,
  ) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.createPayload(
          chainId,
          payloadActions,
          payloadsController,
        );
      },
      params: {
        type: 'createPayload',
        desiredChainID: chainId,
        payload: {
          chainId,
          payloadId,
          payloadsController,
        },
      },
    });
  },

  createProposal: async (votingPortalAddress, payloads, ipfsHash) => {
    const govDataService = get().govDataService;
    const proposalsCount = await govDataService.getTotalProposalsCount();

    const formattedPayloads = await Promise.all(
      payloads.map(async (payload) => {
        let formattedPayload =
          get().detailedPayloadsData[
            `${payload.payloadsController}_${payload.id}`
          ];

        if (!formattedPayload) {
          await get().getDetailedPayloadsData(
            payload.chainId,
            payload.payloadsController,
            [payload.id],
          );
          formattedPayload =
            get().detailedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ];
        }

        return {
          chain: formattedPayload.chainId,
          id: formattedPayload.id,
          accessLevel: formattedPayload.maximumAccessLevelRequired,
          payloadsController: formattedPayload.payloadsController,
        };
      }),
    );

    const cancellationFee = get().contractsConstants.cancellationFee;

    if (!!cancellationFee) {
      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.createProposal(
            votingPortalAddress,
            formattedPayloads,
            ipfsHash,
            cancellationFee,
          );
        },
        params: {
          type: 'createProposal',
          desiredChainID: appConfig.govCoreChainId,
          payload: {
            proposalId: proposalsCount,
          },
        },
      });
    }
  },

  cancelProposal: async (proposalId) => {
    const govDataService = get().govDataService;
    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.cancelProposal(proposalId);
      },
      params: {
        type: 'cancelProposal',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },
});
