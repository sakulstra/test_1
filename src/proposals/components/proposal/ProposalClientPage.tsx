'use client';

import { useRequest } from 'alova';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { Container } from '../../../ui';
import { NotFoundPage } from '../../../ui/pages/NotFoundPage';
import { getCachedProposalsIdsFromGithub } from '../../../utils/githubCacheRequests';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPageWrapper } from './ProposalPageWrapper';
import { ProposalPageWrapperWithCache } from './ProposalPageWrapperWithCache';

export function ProposalClientPage() {
  const searchParams = useSearchParams();
  const id = Number(searchParams?.get('proposalId'));

  const store = useStore();

  const { loading, data, error } = useRequest(getCachedProposalsIdsFromGithub);

  useEffect(() => {
    if (store.totalProposalCount < 0 && id >= 0) {
      store.getTotalProposalCount(true);
    }
  }, [id, store.totalProposalCount]);

  useEffect(() => {
    if (!loading && !error) {
      if (
        !store.cachedProposalsIds.length ||
        store.cachedProposalsIds.length < (data?.cachedProposalsIds.length || 0)
      ) {
        store.setCachedProposalsIds(data?.cachedProposalsIds || []);
      }
    }
  }, [loading, error]);

  if (loading && !store.cachedProposalsIds.length)
    return (
      <Container>
        <ProposalLoading />
      </Container>
    );

  if (store.detailedProposalsData[id]) {
    if (store.detailedProposalsData[id].prerender) {
      return (
        <Container>
          <ProposalPageWrapperWithCache id={id} />
        </Container>
      );
    } else {
      return (
        <Container>
          <ProposalPageWrapper id={id} />
        </Container>
      );
    }
  } else if (
    (store.totalProposalCount - 1 < id && !store.totalProposalCountLoading) ||
    Number.isNaN(id) ||
    id < 0
  ) {
    return <NotFoundPage />;
  } else if (
    !!store.cachedProposalsIds.find((proposalId) => proposalId === id) ||
    store.cachedProposalsIds.find((proposalId) => proposalId === id) === 0
  ) {
    return (
      <Container>
        <ProposalPageWrapperWithCache id={id} />
      </Container>
    );
  } else {
    return (
      <Container>
        <ProposalPageWrapper id={id} />
      </Container>
    );
  }
}
