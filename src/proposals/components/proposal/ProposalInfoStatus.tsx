import { styled } from '@mui/system';

import { ProposalEstimatedState } from '../../../../lib/helpers/src';
import { ProposalEstimatedStatus } from '../ProposalEstimatedStatus';
import {
  ProposalStatusWithDate,
  ProposalStatusWithDateProps,
} from '../ProposalStatusWithDate';

const Wrapper = styled('div')(({ theme }) => ({
  alignItems: 'flex-end',
  justifyContent: 'center',
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    marginTop: 12,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: 20,
  },
  '.ProposalEstimatedStatus, .ProposalStatusWithDate': {
    margin: 0,
    'p, .ProposalStatus': {
      color: theme.palette.$textSecondary,
      [theme.breakpoints.up('lg')]: {
        fontSize: 16,
        lineHeight: '21px',
      },
    },
  },
}));

interface ProposalInfoStatusProps extends ProposalStatusWithDateProps {
  proposalId: number;
  estimatedStatus: ProposalEstimatedState;
  isFinished: boolean;
}

export function ProposalInfoStatus({
  proposalId,
  status,
  timestamp,
  estimatedStatus,
  isFinished,
}: ProposalInfoStatusProps) {
  return (
    <Wrapper>
      {!isFinished ? (
        <ProposalEstimatedStatus
          proposalId={proposalId}
          estimatedStatus={estimatedStatus}
          timestamp={timestamp}
        />
      ) : (
        <ProposalStatusWithDate
          isFinished={isFinished}
          timestamp={timestamp}
          status={status}
        />
      )}
    </Wrapper>
  );
}
