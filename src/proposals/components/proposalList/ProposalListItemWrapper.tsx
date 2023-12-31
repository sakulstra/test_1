import { useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { ProposalEstimatedState } from '../../../../lib/helpers/src';
import { BoxWith3D } from '../../../ui';

export function ProposalListItemWrapper({
  children,
  isVotingActive,
  estimatedState,
  isFinished,
  isForHelpModal,
  disabled,
}: {
  children: ReactNode;
  isVotingActive?: boolean;
  estimatedState?: ProposalEstimatedState;
  isFinished?: boolean;
  isForHelpModal?: boolean;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <BoxWith3D
      disabled={disabled}
      alwaysWithBorders={isForHelpModal}
      withActions={!isForHelpModal}
      borderSize={10}
      disableActiveState={isVotingActive}
      contentColor="$mainLight"
      bottomBorderColor={
        estimatedState === ProposalEstimatedState.Defeated && !isFinished
          ? '$secondaryAgainst'
          : estimatedState === ProposalEstimatedState.Succeed && !isFinished
          ? '$secondaryFor'
          : '$light'
      }
      wrapperCss={{ mb: 20 }}
      css={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: 0,
        [theme.breakpoints.up('lg')]: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '15px 35px',
          minHeight: isFinished ? 0 : 144,
        },
      }}>
      {children}
    </BoxWith3D>
  );
}
