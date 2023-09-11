import { Box } from '@mui/system';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import {
  Balance,
  formatProposal,
  getEstimatedState,
  ProposalState,
  valueToBigNumber,
} from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import { BasicActionModal } from '../../../transactions/components/BasicActionModal';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import { BigButton, ToggleButton } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { setRelativePath } from '../../../ui/utils/relativePath';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { getProposalDataById } from '../../store/proposalsSelectors';
import { EditVotingTokensContent } from '../EditVotingTokensContent';
import { ProposalEstimatedStatus } from '../ProposalEstimatedStatus';
import { VoteBar } from '../VoteBar';
import { VotedState } from '../VotedState';
import { ActionModalBasicTypes } from './types';

export function VoteModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const {
    vote,
    supportObject,
    setSupportObject,
    activeWallet,
    isGelatoAvailable,
    checkIsGelatoAvailable,
    appMode,
    representingAddress,
  } = useStore();

  const [localVotingTokens, setLocalVotingTokens] = useState<Balance[]>([]);
  const [isEditVotingTokensOpen, setEditVotingTokens] = useState(false);

  const proposalData = useStore((store) =>
    getProposalDataById(store, proposalId),
  );

  useEffect(() => {
    if (proposalData) {
      const isFinished =
        proposalData.proposal.state === ProposalState.Executed ||
        proposalData.proposal.state === ProposalState.Defeated ||
        proposalData.proposal.state === ProposalState.Canceled ||
        proposalData.proposal.state === ProposalState.Expired;

      if (!isFinished) {
        checkIsGelatoAvailable(proposalData.proposal.data.votingChainId);
      }
    }
  }, [proposalData?.loading]);

  useEffect(() => {
    if (!Object.keys(supportObject).find((key) => +key === proposalId)) {
      setSupportObject(proposalId, false);
    }
    return () => {
      setEditVotingTokens(false);
      setLocalVotingTokens([]);
    };
  }, []);

  const support = supportObject[proposalId];
  const setSupport = (value: boolean) => setSupportObject(proposalId, value);

  const {
    error,
    setError,
    loading,
    isTxStart,
    txHash,
    txPending,
    txSuccess,
    setIsTxStart,
    txWalletType,
    isError,
    executeTxWithLocalStatuses,
  } = useLastTxLocalStatus({
    type: 'vote',
    payload: {
      proposalId,
      support: !support,
      voter:
        representingAddress[
          proposalData?.proposal.data.votingChainId || appConfig.govCoreChainId
        ] ||
        activeWallet?.accounts[0] ||
        ethers.constants.AddressZero,
    },
  });

  if (!proposalData?.proposal) return null;

  const proposal = proposalData.proposal;

  const {
    minQuorumVotes,
    againstVotes,
    requiredDiff,
    forVotes,
    requiredForVotes,
    requiredAgainstVotes,
    votingPower,
    votingPowerBasic,
    votingTokens,
  } = formatProposal(proposal);

  const localVotingPowerBasic =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => valueToBigNumber(balance.basicValue).toNumber())
          .reduce((sum, value) => sum + value, 0)
      : votingPowerBasic;
  const localVotingPower =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => valueToBigNumber(balance.value).toNumber())
          .reduce((sum, value) => sum + value, 0)
      : votingPower;

  const forVotesWithVotingPowerBasic = !support
    ? valueToBigNumber(proposal.data.votingMachineData.forVotes)
        .plus(localVotingPowerBasic)
        .toString()
    : proposal.data.votingMachineData.forVotes;
  const againstVotesWithVotingPowerBasic = support
    ? valueToBigNumber(proposal.data.votingMachineData.againstVotes)
        .plus(localVotingPowerBasic)
        .toString()
    : proposal.data.votingMachineData.againstVotes;

  const forVotesWithVotingPower = !support
    ? forVotes + localVotingPower
    : forVotes;
  const againstVotesWithVotingPower = support
    ? againstVotes + localVotingPower
    : againstVotes;

  const requiredForVotesAfterVote =
    minQuorumVotes - againstVotesWithVotingPower > requiredDiff &&
    againstVotesWithVotingPower === 0
      ? minQuorumVotes - againstVotesWithVotingPower
      : minQuorumVotes - againstVotesWithVotingPower > requiredDiff &&
        againstVotesWithVotingPower > 0
      ? minQuorumVotes - againstVotesWithVotingPower + requiredDiff
      : againstVotesWithVotingPower + requiredDiff;

  const requiredAgainstVotesAfterVote =
    forVotesWithVotingPower === 0 ? 0 : forVotesWithVotingPower + requiredDiff;

  const forPercentAfterVote = new BigNumber(forVotesWithVotingPower)
    .dividedBy(requiredForVotesAfterVote)
    .multipliedBy(100)
    .toNumber();
  const againstPercentAfterVote = new BigNumber(againstVotesWithVotingPower)
    .dividedBy(
      requiredAgainstVotesAfterVote > 0 ? requiredAgainstVotesAfterVote : 1,
    )
    .multipliedBy(100)
    .toNumber();

  const { estimatedState, timestampForEstimatedState } = getEstimatedState(
    proposal,
    forVotesWithVotingPowerBasic,
    againstVotesWithVotingPowerBasic,
  );

  const handleVote = async (gelato?: boolean) =>
    await executeTxWithLocalStatuses({
      errorMessage: texts.proposalActions.voteError,
      callbackFunction: async () =>
        await vote({
          votingChainId: proposal.data.votingChainId,
          proposalId: proposal.data.id,
          support: !support,
          gelato,
          balances:
            localVotingTokens.length > 0 ? localVotingTokens : votingTokens,
          voterAddress:
            representingAddress[proposalData.proposal.data.votingChainId],
        }),
    });

  return (
    <BasicActionModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      txHash={txHash}
      txSuccess={txSuccess}
      txPending={txPending}
      isTxStart={isTxStart}
      isError={isError}
      setIsTxStart={setIsTxStart}
      error={error}
      setError={setError}
      txWalletType={txWalletType}
      contentMinHeight={isTxStart ? 287 : 211}
      topBlock={
        <Box
          sx={{
            zIndex: isEditVotingTokensOpen ? -1 : 1,
            opacity: isEditVotingTokensOpen ? 0 : 1,
            visibility: isEditVotingTokensOpen ? 'hidden' : 'visible',
          }}>
          <Box
            sx={{
              opacity: isTxStart ? 0 : 1,
              position: 'relative',
              zIndex: isTxStart ? -1 : 1,
            }}>
            <ToggleButton value={support} onToggle={setSupport} />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              mt: isTxStart ? -62 : 32,
              mb: 16,
              position: 'relative',
              zIndex: 2,
            }}>
            <Box component="h3" sx={{ typography: 'h3', fontWeight: '600' }}>
              {proposal.data.title}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: isTxStart ? 0 : 28,
              justifyContent: 'center',
              minHeight: 20,
            }}>
            {isTxStart ? (
              <VotedState support={!support} isBig />
            ) : (
              <ProposalEstimatedStatus
                proposalId={proposalId}
                estimatedStatus={estimatedState}
                timestamp={timestampForEstimatedState}
              />
            )}
          </Box>
        </Box>
      }>
      {!isEditVotingTokensOpen ? (
        <>
          <Box sx={{ width: 296, m: '0 auto 40px' }}>
            <VoteBar
              type="for"
              value={forVotesWithVotingPower}
              requiredValue={requiredForVotesAfterVote}
              linePercent={forPercentAfterVote}
              isValueBig={!support}
              isRequiredValueBig={support}
              withAnim={!loading}
              startValueForCountUp={forVotes}
              startRequiredValueForCountUp={requiredForVotes}
            />
            <VoteBar
              type="against"
              value={againstVotesWithVotingPower}
              requiredValue={requiredAgainstVotesAfterVote}
              linePercent={againstPercentAfterVote}
              isRequiredValueBig={!support}
              isValueBig={support}
              withAnim={!loading}
              startValueForCountUp={againstVotes}
              startRequiredValueForCountUp={requiredAgainstVotes}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              mb: 32,
            }}>
            <Box
              component="p"
              sx={{ typography: 'body', mr: 2, display: 'inline-block' }}>
              {texts.proposals.yourVotingPower}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormattedNumber
                css={{
                  display: 'inline-block',
                  position: 'relative',
                  top: 0.5,
                }}
                variant="headline"
                value={localVotingPower}
                visibleDecimals={2}
              />
              {votingTokens.length > 1 && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    setEditVotingTokens(true);
                    if (localVotingTokens.length <= 0) {
                      setLocalVotingTokens(votingTokens);
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    width: 14,
                    height: 14,
                    ml: 7,
                    hover: { opacity: '0.7' },
                  }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      background: `url(${setRelativePath(
                        '/images/icons/pencil.svg',
                      )})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {activeWallet?.isContractAddress &&
            proposal.data.votingChainId !== appConfig.govCoreChainId ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Box
                  sx={{
                    typography: 'body',
                    color: '$textSecondary',
                  }}>
                  {texts.other.votingNotAvailableForGnosis}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BigButton
                  alwaysWithBorders
                  loading={loading}
                  disabled={
                    loading ||
                    proposal.state > ProposalState.Active ||
                    localVotingPower <= 0
                  }
                  activeColorType={support ? 'against' : 'for'}
                  onClick={() => handleVote(isGelatoAvailable)}>
                  {texts.proposals.vote}
                </BigButton>
                {appMode !== 'default' && isGelatoAvailable && (
                  <Box
                    component="button"
                    disabled={
                      loading ||
                      proposal.state > ProposalState.Active ||
                      localVotingPower <= 0
                    }
                    type="button"
                    onClick={() => handleVote()}
                    sx={{
                      typography: 'descriptor',
                      mt: 10,
                      position: 'relative',
                      right: 4,
                      color: '$textSecondary',
                      hover: { textDecoration: 'underline' },
                    }}>
                    {texts.proposalActions.voteSmallButtonTitle}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </>
      ) : (
        <EditVotingTokensContent
          votingTokens={votingTokens}
          localVotingTokens={localVotingTokens}
          setVotingTokens={setLocalVotingTokens}
          setEditVotingTokens={setEditVotingTokens}
        />
      )}
    </BasicActionModal>
  );
}
