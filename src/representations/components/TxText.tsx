import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../store';
import { getChainName } from '../../ui/utils/getChainName';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { RepresentationFormData } from '../store/representationsSlice';

interface TxTextProps {
  formData: RepresentationFormData[];
  isBeforeTx?: boolean;
}

export function TxText({ formData, isBeforeTx }: TxTextProps) {
  const { activeWallet } = useStore();
  const activeAddress = activeWallet?.accounts[0] || '';

  return (
    <>
      {formData.map((item, index) => {
        const isRepresent =
          item.representative !== undefined &&
          item.representative !== '' &&
          item.representative !== activeAddress;

        const firstText = isRepresent
          ? isBeforeTx
            ? texts.representationsPage.yourWillRepresent
            : texts.representationsPage.yourRepresented
          : isBeforeTx
          ? texts.representationsPage.yourCancelRepresented
          : texts.representationsPage.yourCanceledRepresented;
        const endText = formData.length - 1 !== index ? 'and ' : '';

        return (
          <Box component="span" key={item.chainId}>
            {firstText}{' '}
            {isRepresent &&
              `by ${textCenterEllipsis(item.representative, 5, 5)}`}{' '}
            for <b>{getChainName(item.chainId)}</b> {endText}
          </Box>
        );
      })}
    </>
  );
}
