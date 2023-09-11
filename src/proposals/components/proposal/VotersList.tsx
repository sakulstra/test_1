import { Box, useTheme } from '@mui/system';
import React from 'react';

import { VotersData } from '../../../../lib/helpers/src';
import { Link } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/chains';

interface VotersListProps {
  voters?: VotersData[];
  setIsVotersModalOpen: (value: boolean) => void;
  isVotingFinished: boolean;
  isStarted: boolean;
}

export function VotersList({
  voters,
  setIsVotersModalOpen,
  isVotingFinished,
  isStarted,
}: VotersListProps) {
  const theme = useTheme();

  if (!isStarted) return null;

  return (
    <Box
      sx={{
        mt: 12,
        [theme.breakpoints.up('lg')]: {
          mt: 20,
        },
      }}>
      {!voters?.length ? (
        <Box
          component="p"
          sx={{
            typography: 'body',
            color: '$textSecondary',
            mt: 18,
            textAlign: 'center',
          }}>
          {isVotingFinished
            ? texts.proposals.votersListFinishedNoDataTitle
            : texts.proposals.votersListNoDataTitle}
        </Box>
      ) : (
        <>
          <Box>
            <Box sx={{ display: 'flex', color: '$text', mb: 12 }}>
              <Box
                component="p"
                sx={{
                  typography: 'descriptorAccent',
                  textAlign: 'left',
                  flex: 1,
                }}>
                {texts.proposals.votersListTopVoters}
              </Box>
              <Box
                component="p"
                sx={{
                  typography: 'descriptorAccent',
                  textAlign: 'center',
                  flex: 1,
                }}>
                {texts.proposals.votersListVotingPower}
              </Box>
              <Box
                component="p"
                sx={{
                  typography: 'descriptorAccent',
                  textAlign: 'right',
                  flex: 1,
                }}>
                {texts.proposals.votersListSupport}
              </Box>
            </Box>
            {voters
              .sort((a, b) => b.votingPower - a.votingPower)
              .slice(0, 5)
              .map((vote, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    color: '$text',
                    mb: 12,
                    '&:last-of-type': { mb: 0 },
                  }}
                  key={index}>
                  <Link
                    inNewWindow
                    css={{
                      textAlign: 'left',
                      flex: 1,
                      transition: 'all 0.2s ease',
                      hover: { opacity: '0.5' },
                    }}
                    href={`${
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      chainInfoHelper.getChainParameters(
                        appConfig.govCoreChainId,
                      ).blockExplorerUrls[0]
                    }/address/${vote.address}`}>
                    <Box component="p" sx={{ typography: 'descriptor' }}>
                      {textCenterEllipsis(vote.address, 6, 4)}
                    </Box>
                  </Link>
                  <FormattedNumber
                    variant="descriptor"
                    value={vote.votingPower}
                    visibleDecimals={2}
                    css={{
                      textAlign: 'center',
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                  <Box
                    component="p"
                    sx={{
                      typography: 'descriptorAccent',
                      textAlign: 'right',
                      flex: 1,
                      color: vote.support ? '$mainFor' : '$mainAgainst',
                    }}>
                    {vote.support
                      ? texts.other.toggleFor
                      : texts.other.toggleAgainst}
                  </Box>
                </Box>
              ))}
          </Box>

          {voters.length > 5 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 18,
                  [theme.breakpoints.up('lg')]: { mt: 25 },
                }}>
                <button
                  type="button"
                  onClick={() => setIsVotersModalOpen(true)}>
                  <Box
                    component="p"
                    sx={{
                      typography: 'descriptor',
                      color: '$textSecondary',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      hover: { color: theme.palette.$text },
                    }}>
                    {texts.proposals.votersListShowAll} {voters.length}
                  </Box>
                </button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
