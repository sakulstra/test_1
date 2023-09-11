import { Box, useTheme } from '@mui/system';
import React from 'react';

import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { texts } from '../../../ui/utils/texts';

interface VotingPowerProps {
  balanceLoading: boolean;
  isVoted: boolean;
  votingPower: number;
}

export function VotingPower({
  balanceLoading,
  isVoted,
  votingPower,
}: VotingPowerProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        textAlign: 'left',
        minWidth: 145,
        display: 'flex',
        alignItems: 'flex-end',
        [theme.breakpoints.up('md')]: { textAlign: 'center', display: 'block' },
        '.VotingPowerLoading__value': {
          height: 19,
        },
      }}>
      <Box
        component="p"
        sx={{
          typography: 'body',
          color: '$textSecondary',
          mr: 6,
          position: 'relative',
          bottom: 1.5,
          [theme.breakpoints.up('md')]: { mb: 8, bottom: 0, mr: 0 },
        }}>
        {texts.proposals.yourVotingPower}
      </Box>

      {balanceLoading && !isVoted ? (
        <CustomSkeleton width={60} height={19} />
      ) : (
        <FormattedNumber
          variant="h3"
          css={{ '> p': { fontWeight: 600 } }}
          value={votingPower}
          visibleDecimals={2}
        />
      )}
    </Box>
  );
}
