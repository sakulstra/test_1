import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import CheckIcon from '/public/images/icons/check.svg';
import CopyIcon from '/public/images/icons/copy.svg';
import CrossIcon from '/public/images/icons/cross.svg';

import { selectTxExplorerLink } from '../../../lib/web3/src';
import { DelegatedText } from '../../delegate/components/DelegatedText';
import { TxText } from '../../representations/components/TxText';
import { useStore } from '../../store';
import { CopyToClipboard, Link, Spinner } from '../../ui';
import { IconBox } from '../../ui/primitives/IconBox';
import { getChainName } from '../../ui/utils/getChainName';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/chains';
import { getTokenName } from '../../utils/getTokenName';
import { TransactionUnion } from '../store/transactionsSlice';

interface TransactionInfoItemProps {
  tx: TransactionUnion;
}

export function TransactionInfoItem({ tx }: TransactionInfoItemProps) {
  const theme = useTheme();
  const state = useStore();

  const chainName = getChainName(tx.chainId);
  const govCoreChainName = getChainName(appConfig.govCoreChainId);

  return (
    <Box sx={{ mb: 15, width: '100%', '&:last-of-type': { mb: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box component="p" sx={{ typography: 'descriptor' }}>
          {tx.localTimestamp && (
            <Box component="span" sx={{ typography: 'descriptorAccent' }}>
              {tx.type === 'test'
                ? dayjs.unix(tx.localTimestamp).format('MMM D, h:mm A')
                : dayjs(tx.localTimestamp).format('MMM D, h:mm A')}
            </Box>
          )}{' '}
          {tx.type === 'test' && <>{texts.transactions.testTransaction}</>}
          {tx.type === 'createPayload' && tx.payload && (
            <>
              {texts.transactions.createPayloadTx}{' '}
              <b>#{tx.payload.payloadId}</b> on {chainName}
            </>
          )}
          {tx.type === 'createProposal' && tx.payload && (
            <>
              {texts.transactions.createProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on {chainName}
            </>
          )}
          {tx.type === 'activateVoting' && tx.payload && (
            <>
              {texts.transactions.activateVotingTx}{' '}
              <b>#{tx.payload.proposalId}</b> on {chainName}
            </>
          )}
          {tx.type === 'sendProofs' && tx.payload && (
            <>
              {texts.transactions.sendProofsTx}{' '}
              <b>{getTokenName(tx.payload.underlyingAsset)}</b> for the proposal{' '}
              <b>#{tx.payload.proposalId}</b>, on {chainName}
            </>
          )}
          {tx.type === 'activateVotingOnVotingMachine' && tx.payload && (
            <>
              {texts.transactions.activateVotingOnVotingMachineTx}{' '}
              <b>#{tx.payload.proposalId}</b>, on {chainName}
            </>
          )}
          {tx.type === 'vote' && tx.payload && (
            <>
              {texts.transactions.voteTx}{' '}
              <b>{tx.payload.support ? 'for' : 'against'}</b> for the proposal{' '}
              <b>#{tx.payload.proposalId}</b>
            </>
          )}
          {tx.type === 'closeAndSendVote' && tx.payload && (
            <>
              {texts.transactions.closeVoteTx} <b>#{tx.payload.proposalId}</b>{' '}
              on {chainName} {texts.transactions.sendVoteResultsTx}{' '}
              {govCoreChainName}
            </>
          )}
          {tx.type === 'executeProposal' && tx.payload && (
            <>
              {texts.transactions.executeProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on {chainName}
            </>
          )}
          {tx.type === 'executePayload' && tx.payload && (
            <>
              {texts.transactions.executePayloadTx}{' '}
              <b>#{tx.payload.payloadId}</b> on {chainName}
            </>
          )}
          {tx.type === 'delegate' && tx.payload && (
            <>
              <DelegatedText
                delegateData={tx.payload.delegateData}
                formDelegateData={tx.payload.formDelegateData}
              />{' '}
              on {chainName}
            </>
          )}
          {tx.type === 'cancelProposal' && tx.payload && (
            <>
              {texts.transactions.cancelProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on {chainName}
            </>
          )}
          {tx.type === 'representations' && tx.payload && (
            <>
              <TxText formData={tx.payload.data} /> on {chainName}
            </>
          )}
        </Box>

        <Box sx={{ ml: 10, lineHeight: 0, backgroundColor: '$paper' }}>
          {tx.pending && (
            <Spinner
              size={16}
              loaderLineColor="$paper"
              loaderCss={{ backgroundColor: '$main' }}
            />
          )}
          {tx.status && (
            <IconBox
              sx={{
                width: 16,
                height: 16,
                '> svg': {
                  width: 16,
                  height: 16,
                },
                path: {
                  stroke:
                    tx.status === 1
                      ? theme.palette.$mainFor
                      : theme.palette.$mainAgainst,
                },
              }}>
              {tx.status === 1 ? <CheckIcon /> : <CrossIcon />}
            </IconBox>
          )}
        </Box>
      </Box>

      {tx.hash && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Link
            href={selectTxExplorerLink(
              state,
              chainInfoHelper.getChainParameters,
              tx.hash,
            )}
            css={{
              color: '$textSecondary',
              hover: { color: theme.palette.$text },
            }}
            inNewWindow>
            <Box component="p" sx={{ typography: 'descriptor' }}>
              {textCenterEllipsis(tx.hash, 5, 5)}
            </Box>
          </Link>

          <CopyToClipboard copyText={tx.hash}>
            <IconBox
              sx={{
                cursor: 'pointer',
                width: 10,
                height: 10,
                '> svg': {
                  width: 10,
                  height: 10,
                },
                ml: 3,
                path: {
                  transition: 'all 0.2s ease',
                  stroke: theme.palette.$textSecondary,
                },
                hover: { path: { stroke: theme.palette.$main } },
              }}>
              <CopyIcon />
            </IconBox>
          </CopyToClipboard>
        </Box>
      )}
    </Box>
  );
}
