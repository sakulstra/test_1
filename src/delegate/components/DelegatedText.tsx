import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../store';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { getTokenName, Token } from '../../utils/getTokenName';
import { DelegateData, DelegateItem, TxDelegateData } from '../types';

interface DelegatedTextProps {
  delegateData: DelegateItem[];
  formDelegateData: DelegateData[];
  isBeforeTx?: boolean;
}

export function DelegatedText({
  delegateData,
  formDelegateData,
  isBeforeTx,
}: DelegatedTextProps) {
  const { activeWallet } = useStore();
  const activeAddress = activeWallet?.accounts[0] || '';

  const delegatedData: TxDelegateData[] = [];
  for (const formDelegateItem of formDelegateData) {
    const { votingToAddress, propositionToAddress, underlyingAsset } =
      formDelegateItem;
    const symbol = getTokenName(underlyingAsset) || Token.AAVE;

    // get previous delegation data for current asset
    const delegateDataLocal: DelegateItem = delegateData.filter(
      (data) => data.underlyingAsset === underlyingAsset,
    )[0];

    const isAddressSame = votingToAddress === propositionToAddress;
    const isInitialAddressSame =
      delegateDataLocal?.propositionToAddress ===
      delegateDataLocal?.votingToAddress;

    const isVotingToAddressSame =
      delegateDataLocal?.votingToAddress === votingToAddress;
    const isPropositionToAddressSame =
      delegateDataLocal?.propositionToAddress === propositionToAddress;

    // check if delegationTo is the same address and not equal to previous delegation
    if (
      isAddressSame &&
      (!isInitialAddressSame ||
        votingToAddress !== delegateDataLocal?.votingToAddress)
    ) {
      delegatedData.push({
        symbol,
        underlyingAsset,
        bothAddresses: votingToAddress,
      });
    } else {
      // if delegationTo are different addresses
      // check if need to re-delegate voting
      if (!isVotingToAddressSame) {
        delegatedData.push({
          symbol,
          underlyingAsset,
          votingToAddress,
        });
      }
      // check if need to re-delegate proposition
      if (!isPropositionToAddressSame) {
        delegatedData.push({
          symbol,
          underlyingAsset,
          propositionToAddress,
        });
      }
    }
  }

  return (
    <>
      {delegatedData.map((data, index) => {
        const isBothPowersDelegated =
          data.bothAddresses !== '' && data.bothAddresses !== activeAddress;
        const isVotingPowerDelegated =
          data.votingToAddress !== '' && data.votingToAddress !== activeAddress;
        const isPropositionPowerDelegated =
          data.propositionToAddress !== '' &&
          data.propositionToAddress !== activeAddress;

        const firstText =
          typeof data.bothAddresses !== 'undefined'
            ? isBothPowersDelegated
              ? isBeforeTx
                ? texts.delegatePage.willDelegate
                : texts.delegatePage.delegated
              : isBeforeTx
              ? texts.delegatePage.receiveBack
              : texts.delegatePage.receivedBack
            : typeof data.votingToAddress !== 'undefined'
            ? isVotingPowerDelegated
              ? isBeforeTx
                ? texts.delegatePage.willDelegate
                : texts.delegatePage.delegated
              : isBeforeTx
              ? texts.delegatePage.receiveBack
              : texts.delegatePage.receivedBack
            : typeof data.propositionToAddress !== 'undefined'
            ? isPropositionPowerDelegated
              ? isBeforeTx
                ? texts.delegatePage.willDelegate
                : texts.delegatePage.delegated
              : isBeforeTx
              ? texts.delegatePage.receiveBack
              : texts.delegatePage.receivedBack
            : '';

        const middleText =
          typeof data.bothAddresses !== 'undefined'
            ? `${texts.delegatePage.votingAndPropositionPowers} ${
                isBothPowersDelegated
                  ? `to ${textCenterEllipsis(data.bothAddresses, 6, 4)}`
                  : ''
              }`
            : typeof data.votingToAddress !== 'undefined'
            ? `${texts.delegatePage.votingPower} ${
                isVotingPowerDelegated
                  ? `to ${textCenterEllipsis(data.votingToAddress, 6, 4)}`
                  : ''
              }`
            : typeof data.propositionToAddress !== 'undefined'
            ? `${texts.delegatePage.propositionPower} ${
                isPropositionPowerDelegated
                  ? `to ${textCenterEllipsis(data.propositionToAddress, 6, 4)}`
                  : ''
              }`
            : '';

        const endText = delegatedData.length - 1 !== index ? 'and ' : '';

        return (
          <Box component="span" sx={{ typography: 'body' }} key={index}>
            {firstText} <b>{data.symbol}</b> {middleText} {endText}
          </Box>
        );
      })}
    </>
  );
}
