import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import {
  getVotingMachineProposalState,
  ProposalData,
} from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import {
  getProposalDetailsCache,
  getProposalVotesCache,
} from '../../../utils/githubCacheRequests';
import { setProposalDetailsVoters } from '../../store/proposalsSelectors';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPageWrapper } from './ProposalPageWrapper';

interface ProposalPageWrapperWithCacheProps {
  id: number;
}

export function ProposalPageWrapperWithCache({
  id,
}: ProposalPageWrapperWithCacheProps) {
  const store = useStore();

  const {
    loading: detailsLoading,
    data: detailsData,
    error: detailsError,
  } = useRequest(getProposalDetailsCache(id));
  const {
    loading: votesLoading,
    data: votesData,
    error: votesError,
  } = useRequest(getProposalVotesCache(id));

  useEffect(() => {
    if (!detailsLoading && !detailsError) {
      const detailedProposalsData: Record<number, ProposalData> = {};

      if (detailsData) {
        detailedProposalsData[id] = {
          ...detailsData.proposal,
          votingMachineState: getVotingMachineProposalState(
            detailsData.proposal,
          ),
          payloads: detailsData.payloads || [],
          title: detailsData.ipfs.title || `Proposal #${id}`,
          prerender: true,
        };

        detailsData.payloads.forEach((payload) => {
          if (payload) {
            store.setDetailedPayloadsData(
              `${payload.payloadsController}_${payload.id}`,
              payload,
            );
          }
        });
        store.setIpfsData(detailsData.proposal.ipfsHash, detailsData.ipfs);
        store.setDetailedProposalsData(id, detailedProposalsData[id]);
      }
    }
  }, [detailsLoading, detailsError, detailsData]);

  useEffect(() => {
    if (!votesLoading && !votesError) {
      if (votesData) {
        setProposalDetailsVoters(store, votesData.votes);
      }
    }
  }, [votesLoading, votesError, votesData]);

  if ((detailsLoading && !detailsData) || (votesLoading && !votesData))
    return <ProposalLoading />;

  return <ProposalPageWrapper id={id} />;
}
