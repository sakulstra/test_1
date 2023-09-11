import { Box, styled, useTheme } from '@mui/system';
import React from 'react';

import { selectLastTxByTypeAndPayload } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { BigButton, BoxWith3D, NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { getChainName } from '../../../ui/utils/getChainName';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { VotedState } from '../VotedState';

const VotingPowerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  [theme.breakpoints.up('lg')]: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface ProposalVotingPowerProps {
  balanceLoading: boolean;
  votingPower: number;
  votedPower: number;
  proposalId: number;
  onClick: () => void;
  support: boolean;
  isVoted: boolean;
  isFinished: boolean;
  isStarted: boolean;
  isAnyVote?: boolean;
  votingChainId: number;
}

export function ProposalVotingPower({
  balanceLoading,
  votingPower,
  votedPower,
  proposalId,
  onClick,
  support,
  isVoted,
  isFinished,
  isStarted,
  isAnyVote,
  votingChainId,
}: ProposalVotingPowerProps) {
  const theme = useTheme();
  const lg = useMediaQuery(media.lg);

  const supportObject = useStore((state) => state.supportObject);
  const activeWallet = useStore((state) => state.activeWallet);
  const representingAddress = useStore((state) => state.representingAddress);

  const tx = useStore((state) =>
    selectLastTxByTypeAndPayload(
      state,
      activeWallet?.accounts[0] || '',
      'vote',
      {
        proposalId,
        support: !supportObject[proposalId],
        voter: representingAddress[votingChainId] || activeWallet?.accounts[0],
      },
    ),
  );

  if (!activeWallet?.isActive) return null;
  if (!isAnyVote && isFinished) return null;

  const VotedBlock = () => {
    return (
      <Box
        sx={{
          typography: 'body',
          display: 'inline',
          textAlign: 'center',
          color: '$text',
          lineHeight: '22px',
          '*': {
            display: 'inline',
          },
        }}>
        <VotedState support={support} css={{ color: '$text' }} />{' '}
        <>
          with{' '}
          <FormattedNumber
            variant="body"
            value={votedPower}
            visibleDecimals={2}
          />{' '}
          voting power
        </>
      </Box>
    );
  };

  return (
    <NoSSR>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          minHeight: 60,
          p: !isVoted && votingPower > 0 ? 20 : '12px 20px',
          [theme.breakpoints.up('md')]: {
            minHeight: 70,
          },
          [theme.breakpoints.up('lg')]: {
            minHeight: 80,
          },
        }}>
        <>
          {activeWallet?.isActive && (
            <>
              {isFinished ? (
                <>
                  {!isVoted ? (
                    <Box
                      component="p"
                      sx={{ typography: 'body', textAlign: 'center' }}>
                      {texts.proposals.notVoted}
                    </Box>
                  ) : (
                    <VotedBlock />
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    [theme.breakpoints.up('sm')]: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  }}>
                  {isStarted ? (
                    <>
                      {!isVoted && votingPower > 0 && (
                        <VotingPowerWrapper>
                          <Box
                            component="p"
                            sx={{
                              typography: lg ? 'h3' : 'body',
                              mb: 4,
                              [theme.breakpoints.up('sm')]: { mb: 0 },
                            }}>
                            {texts.proposals.yourVotingPower}
                          </Box>

                          {balanceLoading ? (
                            <CustomSkeleton width={50} height={20} />
                          ) : (
                            <FormattedNumber
                              variant="h3"
                              value={votingPower}
                              visibleDecimals={2}
                              css={{
                                position: 'relative',
                                [theme.breakpoints.up('sm')]: {
                                  top: 1,
                                  ml: 10,
                                },
                                [theme.breakpoints.up('lg')]: { top: 0, ml: 0 },
                                '> p': {
                                  fontWeight: 600,
                                },
                              }}
                            />
                          )}
                        </VotingPowerWrapper>
                      )}
                      {balanceLoading ? (
                        <>
                          <VotingPowerWrapper>
                            <Box
                              component="p"
                              sx={{
                                typography: lg ? 'h3' : 'body',
                                mb: 4,
                                [theme.breakpoints.up('sm')]: { mb: 0 },
                              }}>
                              {texts.proposals.yourVotingPower}
                            </Box>
                            <CustomSkeleton width={50} height={20} />
                          </VotingPowerWrapper>
                          <CustomSkeleton width={120} height={30} />
                        </>
                      ) : (
                        <>
                          {isVoted ? (
                            <VotedBlock />
                          ) : (
                            <>
                              {votingPower > 0 ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                  }}>
                                  <BigButton
                                    loading={
                                      tx &&
                                      tx.type === 'vote' &&
                                      tx.payload.proposalId === proposalId &&
                                      tx.payload.voter ===
                                        (representingAddress[votingChainId] ||
                                          activeWallet.accounts[0]) &&
                                      tx.chainId === votingChainId &&
                                      (tx.pending || tx.status === 1)
                                    }
                                    onClick={onClick}>
                                    {texts.proposals.vote}
                                  </BigButton>
                                  <Box
                                    component="p"
                                    sx={{ typography: 'descriptor', mt: 4 }}>
                                    on {getChainName(votingChainId)}
                                  </Box>
                                </Box>
                              ) : (
                                <Box
                                  component="p"
                                  sx={{
                                    typography: 'body',
                                    textAlign: 'center',
                                    lineHeight: '22px',
                                  }}>
                                  {texts.proposals.notEnoughPower}
                                </Box>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Box
                      component="p"
                      sx={{
                        typography: 'body',
                        color: '$textSecondary',
                        textAlign: 'center',
                      }}>
                      {texts.proposals.votingNotStarted(votingChainId)}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </>
      </BoxWith3D>
    </NoSSR>
  );
}
