import { Box, styled, useTheme } from '@mui/system';
import React, { useState } from 'react';

import BackArrowIcon from '/public/images/icons/backArrow.svg';

import { VotersData } from '../../../../lib/helpers/src';
import { BasicModal } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { IconBox } from '../../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { VoteBar } from '../VoteBar';

const BarWrapper = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: -32,
  backgroundColor: theme.palette.$paper,
  zIndex: 2,
  marginBottom: 24,
  [theme.breakpoints.up('sm')]: { top: 0 },
}));

const ListItem = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  color: theme.palette.$main,
  '&:last-of-type': {
    marginBottom: 0,
  },
}));

const TypeChangeButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 90,
  height: 26,
  borderColor: theme.palette.$main,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.palette.$main,
  backgroundColor: theme.palette.$mainLight,
  transition: 'all 0.2s ease',
  '&:active': {
    backgroundColor: theme.palette.$disabled,
    borderColor: theme.palette.$disabled,
  },
}));

interface VotersModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  voters: VotersData[];
  title: string;
  forPercent: number;
  forVotes: number;
  againstPercent: number;
  againstVotes: number;
  requiredForVotes: number;
  requiredAgainstVotes: number;
  isFinished: boolean;
}

export function VotersModal({
  isOpen,
  setIsOpen,
  voters,
  title,
  forPercent,
  forVotes,
  againstPercent,
  againstVotes,
  requiredForVotes,
  requiredAgainstVotes,
  isFinished,
}: VotersModalProps) {
  const theme = useTheme();
  const [type, setType] = useState<'for' | 'against'>('for');

  const isFor = type === 'for';

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      maxWidth={695}>
      <Box sx={{ px: 16, [theme.breakpoints.up('sm')]: { px: 0 } }}>
        <Box component="h3" sx={{ typography: 'h3', mb: 24, fontWeight: 600 }}>
          {title}
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: {
              height: 290,
              overflowY: 'auto',
              pr: 32,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            },
          }}>
          <Box sx={{ [theme.breakpoints.up('sm')]: { display: 'none' } }}>
            <BarWrapper>
              <VoteBar
                type={type}
                value={isFor ? forVotes : againstVotes}
                requiredValue={isFor ? requiredForVotes : requiredAgainstVotes}
                linePercent={isFor ? forPercent : againstPercent}
                isFinished={isFinished}
              />
              <Box
                sx={{
                  display: 'flex',
                  mt: 20,
                  justifyContent: isFor ? 'flex-end' : 'flex-start',
                }}>
                <TypeChangeButton
                  type="button"
                  onClick={() => setType(isFor ? 'against' : 'for')}>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {!isFor && (
                      <IconBox
                        sx={{
                          mr: 5,
                          width: 17,
                          height: 10,
                          '> svg': { width: 17, height: 10 },
                        }}>
                        <BackArrowIcon />
                      </IconBox>
                    )}
                    {isFor ? texts.other.toggleAgainst : texts.other.toggleFor}
                    {isFor && (
                      <IconBox
                        sx={{
                          ml: 5,
                          width: 17,
                          height: 10,
                          '> svg': {
                            width: 17,
                            height: 10,
                          },
                          transform: 'rotate(180deg)',
                        }}>
                        <BackArrowIcon />
                      </IconBox>
                    )}
                  </Box>
                </TypeChangeButton>
              </Box>
            </BarWrapper>

            <ListItem>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.voters}
              </Box>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.votersListVotingPower}
              </Box>
            </ListItem>

            {voters
              .filter((vote) => (type === 'for' ? vote.support : !vote.support))
              .map((vote, index) => (
                <ListItem key={index}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {textCenterEllipsis(vote.address, 6, 4)}
                  </Box>
                  <FormattedNumber
                    value={vote.votingPower}
                    visibleDecimals={3}
                  />
                </ListItem>
              ))}
          </Box>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block', width: '46%' },
            }}>
            <BarWrapper>
              <VoteBar
                type="for"
                value={forVotes}
                requiredValue={requiredForVotes}
                linePercent={forPercent}
                isFinished={isFinished}
              />
            </BarWrapper>
            <ListItem>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.voters}
              </Box>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.votersListVotingPower}
              </Box>
            </ListItem>
            {voters
              .filter((vote) => vote.support)
              .map((vote, index) => (
                <ListItem key={index}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {textCenterEllipsis(vote.address, 6, 4)}
                  </Box>
                  <FormattedNumber
                    value={vote.votingPower}
                    visibleDecimals={3}
                  />
                </ListItem>
              ))}
          </Box>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block', width: '46%' },
            }}>
            <BarWrapper>
              <VoteBar
                type="against"
                value={againstVotes}
                requiredValue={requiredAgainstVotes}
                linePercent={againstPercent}
                isFinished={isFinished}
              />
            </BarWrapper>
            <ListItem>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.voters}
              </Box>
              <Box component="p" sx={{ typography: 'headline' }}>
                {texts.proposals.votersListVotingPower}
              </Box>
            </ListItem>
            {voters
              .filter((vote) => !vote.support)
              .map((vote, index) => (
                <ListItem key={index}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {textCenterEllipsis(vote.address, 6, 4)}
                  </Box>
                  <FormattedNumber
                    value={vote.votingPower}
                    visibleDecimals={3}
                  />
                </ListItem>
              ))}
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
}
