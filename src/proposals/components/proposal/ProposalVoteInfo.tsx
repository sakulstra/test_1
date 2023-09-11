import { Box, useTheme } from '@mui/system';
import React from 'react';

import {
  ProposalEstimatedState,
  ProposalState,
  VotersData,
} from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import { BoxWith3D, NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { VoteBar } from '../VoteBar';
import { ProposalInfoStatus } from './ProposalInfoStatus';
import { VotersList } from './VotersList';
import { VotersModal } from './VotersModal';

interface ProposalVoteInfoProps {
  proposalId: number;
  title: string;
  forPercent: number;
  forVotes: number;
  againstPercent: number;
  againstVotes: number;
  requiredForVotes: number;
  requiredAgainstVotes: number;
  estimatedStatus: ProposalEstimatedState;
  isFinished: boolean;
  isStarted: boolean;
  isVotingFinished: boolean;
  statusTimestamp: number;
  status: ProposalState;
  voters?: VotersData[];
}

export function ProposalVoteInfo({
  proposalId,
  title,
  forPercent,
  forVotes,
  againstPercent,
  againstVotes,
  requiredForVotes,
  requiredAgainstVotes,
  estimatedStatus,
  isFinished,
  isStarted,
  isVotingFinished,
  statusTimestamp,
  status,
  voters,
}: ProposalVoteInfoProps) {
  const theme = useTheme();
  const { isVotersModalOpen, setIsVotersModalOpen, isRendered } = useStore();

  if (!isRendered) {
    return (
      <BoxWith3D
        className="ProposalLoading__SSR"
        borderSize={10}
        contentColor="$mainLight"
        wrapperCss={{ mb: 12 }}
        css={{
          p: 20,
          [theme.breakpoints.up('sm')]: {
            p: '20px 18px 18px',
          },
          [theme.breakpoints.up('lg')]: {
            p: '25px 22px 22px',
          },
        }}>
        <Box
          sx={{
            width: '100%',
          }}>
          <Box sx={{ width: '100%', mb: 12 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={50} height={14} />
              <CustomSkeleton width={50} height={14} />
            </Box>
            <CustomSkeleton width="100%" height={10} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={50} height={14} />
              <CustomSkeleton width={50} height={14} />
            </Box>
            <CustomSkeleton width="100%" height={10} />
          </Box>

          <Box sx={{ m: '10px auto', width: '80%' }}>
            <CustomSkeleton width="100%" height={18} />
          </Box>
        </Box>
      </BoxWith3D>
    );
  }

  return (
    <NoSSR>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        bottomBorderColor={
          estimatedStatus === ProposalEstimatedState.Defeated && !isFinished
            ? '$secondaryAgainst'
            : estimatedStatus === ProposalEstimatedState.Succeed && !isFinished
            ? '$secondaryFor'
            : '$light'
        }
        wrapperCss={{ mb: 12 }}
        css={{
          p: 20,
          [theme.breakpoints.up('sm')]: {
            p: '20px 18px 18px',
          },
          [theme.breakpoints.up('lg')]: {
            p: '25px 22px 22px',
          },
        }}>
        <VoteBar
          type="for"
          value={forVotes}
          requiredValue={requiredForVotes}
          linePercent={forPercent}
          isFinished={isVotingFinished}
        />
        <VoteBar
          type="against"
          value={againstVotes}
          requiredValue={requiredAgainstVotes}
          linePercent={againstPercent}
          isFinished={isVotingFinished}
        />

        <ProposalInfoStatus
          proposalId={proposalId}
          isFinished={isFinished}
          status={status}
          estimatedStatus={estimatedStatus}
          timestamp={statusTimestamp}
        />

        <VotersList
          voters={voters}
          setIsVotersModalOpen={setIsVotersModalOpen}
          isVotingFinished={isVotingFinished}
          isStarted={isStarted}
        />
      </BoxWith3D>

      {voters && voters.length > 5 && (
        <VotersModal
          isOpen={isVotersModalOpen}
          setIsOpen={setIsVotersModalOpen}
          voters={voters}
          title={title}
          forPercent={forPercent}
          forVotes={forVotes}
          againstPercent={againstPercent}
          againstVotes={againstVotes}
          requiredForVotes={requiredForVotes}
          requiredAgainstVotes={requiredAgainstVotes}
          isFinished={isVotingFinished}
        />
      )}
    </NoSSR>
  );
}
