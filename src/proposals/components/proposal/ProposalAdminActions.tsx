// TODO: maybe need remove after release

import { Box, useTheme } from '@mui/system';
import React from 'react';

import {
  BasicProposalState,
  getProposalStepsAndAmounts,
} from '../../../../lib/helpers/src';
import { selectLastTxByTypeAndPayload } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { BigButton, BoxWith3D } from '../../../ui';
import { getProposalDataById } from '../../store/proposalsSelectors';
import { CancelProposalModal } from '../actionModals/CancelProposalModal';

export const adminAddresses = ['0xAd9A211D227d2D9c1B5573f73CDa0284b758Ac0C'];

interface ProposalAdminActionsProps {
  proposalId: number;
}

export function ProposalAdminActions({
  proposalId,
}: ProposalAdminActionsProps) {
  const theme = useTheme();
  const store = useStore();
  const {
    activeWallet,
    isCancelProposalModalOpen,
    setIsCancelProposalModalOpen,
    appMode,
  } = useStore();

  const proposalData = useStore((store) =>
    getProposalDataById(store, proposalId),
  );

  if (appMode !== 'expert') return null;
  if (!activeWallet) return null;
  if (!adminAddresses.some((address) => address === activeWallet?.accounts[0]))
    return null;
  if (!proposalData?.proposal) return null;
  if (proposalData.proposal.data.basicState === BasicProposalState.Executed)
    return null;

  const getTxStatus = ({ payload }: Pick<TransactionUnion, 'payload'> & {}) => {
    const tx = selectLastTxByTypeAndPayload(
      store,
      activeWallet?.accounts[0] || '',
      'cancelProposal',
      payload,
    );

    const isPending =
      tx &&
      tx.type === 'cancelProposal' &&
      tx.payload.proposalId === proposalId &&
      tx.pending;

    const isSuccess =
      tx &&
      tx.type === 'cancelProposal' &&
      tx.payload.proposalId === proposalId &&
      tx.status === 1;

    return { isPending, isSuccess };
  };

  const { isProposalActive } = getProposalStepsAndAmounts({
    proposalData: proposalData.proposal.data,
    quorum: proposalData.proposal.config.quorum,
    differential: proposalData.proposal.config.differential,
    precisionDivider: proposalData.proposal.precisionDivider,
    cooldownPeriod: proposalData.proposal.timings.cooldownPeriod,
    executionPayloadTime: proposalData.proposal.timings.executionPayloadTime,
  });

  if (!isProposalActive) return null;

  return (
    <>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        wrapperCss={{
          mt: 16,
          [theme.breakpoints.up('sm')]: {
            mt: 20,
          },
        }}
        css={{
          display: 'flex',
          p: 20,
          flexDirection: 'column',
          alignItems: 'flex-start',
          minHeight: 71,
          flexWrap: 'wrap',
          [theme.breakpoints.up('sm')]: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minHeight: 95,
          },
          [theme.breakpoints.up('lg')]: {
            minHeight: 118,
          },
        }}>
        <Box
          component="h3"
          sx={{
            typography: 'h3',
            mb: 12,
            fontWeight: 600,
            [theme.breakpoints.up('sm')]: {
              typography: 'h3',
              fontWeight: 600,
              mb: 16,
            },
            [theme.breakpoints.up('lg')]: {
              typography: 'h3',
              fontWeight: 600,
              mb: 22,
            },
          }}>
          Admin actions
        </Box>
        <BigButton
          css={{ mb: 8 }}
          disabled={
            getTxStatus({
              payload: { proposalId },
            }).isSuccess
          }
          loading={
            getTxStatus({
              payload: { proposalId },
            }).isPending
          }
          onClick={() => setIsCancelProposalModalOpen(true)}>
          Cancel proposal {proposalId}
        </BigButton>
      </BoxWith3D>

      <CancelProposalModal
        isOpen={isCancelProposalModalOpen}
        setIsOpen={setIsCancelProposalModalOpen}
        proposalId={proposalId}
      />
    </>
  );
}
