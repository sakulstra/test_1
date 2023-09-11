import { Box } from '@mui/system';
import React from 'react';

import { selectLastTxByTypeAndPayload } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { SmallButton } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { texts } from '../../../ui/utils/texts';

interface VoteButtonProps {
  balanceLoading: boolean;
  votingPower: number;
  proposalId: number;
  votingChainId: number;
  onClick: (proposalId: number) => void;
}

export function VoteButton({
  balanceLoading,
  votingPower,
  proposalId,
  votingChainId,
  onClick,
}: VoteButtonProps) {
  const representingAddress = useStore((state) => state.representingAddress);
  const getActiveAddress = useStore((state) => state.getActiveAddress);
  const supportObject = useStore((state) => state.supportObject);

  const activeAddress = getActiveAddress();

  const tx = useStore((state) =>
    selectLastTxByTypeAndPayload(state, activeAddress || '', 'vote', {
      proposalId,
      support: !supportObject[proposalId],
      voter: representingAddress[votingChainId] || activeAddress,
    }),
  );

  const buttonLoading =
    tx &&
    tx.type === 'vote' &&
    tx.payload.proposalId === proposalId &&
    tx.payload.voter ===
      (representingAddress[votingChainId] || activeAddress) &&
    tx.chainId === votingChainId &&
    (tx.pending || tx.status === 1);

  return (
    <>
      {balanceLoading ? (
        <CustomSkeleton width={102} height={22} />
      ) : (
        <>
          {votingPower > 0 ? (
            <SmallButton
              loading={buttonLoading}
              onClick={(e) => {
                e.preventDefault();
                onClick(proposalId);
              }}>
              {texts.proposals.vote}
            </SmallButton>
          ) : (
            <Box
              component="p"
              sx={{ typography: 'body', color: '$textSecondary' }}>
              <Box
                component="span"
                sx={{ typography: 'headline', color: '$text' }}>
                {texts.proposals.notEnough}
              </Box>{' '}
              {texts.proposals.toVote}
            </Box>
          )}
        </>
      )}
    </>
  );
}
