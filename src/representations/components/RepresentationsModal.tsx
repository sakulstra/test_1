import React from 'react';

import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../proposals/components/actionModals/ActionModalContentWrapper';
import {
  BasicActionModal,
  BasicActionModalProps,
} from '../../transactions/components/BasicActionModal';
import { texts } from '../../ui/utils/texts';
import { RepresentationFormData } from '../store/representationsSlice';
import { TxText } from './TxText';

export function RepresentationsModal({
  isOpen,
  setIsOpen,
  isTxStart,
  txHash,
  txPending,
  txSuccess,
  txWalletType,
  setIsTxStart,
  setError,
  error,
  isError,
  formData,
}: Pick<
  BasicActionModalProps,
  | 'isOpen'
  | 'setIsOpen'
  | 'isTxStart'
  | 'txHash'
  | 'txPending'
  | 'txSuccess'
  | 'txWalletType'
  | 'setIsTxStart'
  | 'setError'
  | 'isError'
  | 'error'
> & { formData: RepresentationFormData[] }) {
  return (
    <BasicActionModal
      isTxStart={isTxStart}
      txHash={txHash}
      txPending={txPending}
      txSuccess={txSuccess}
      txWalletType={txWalletType}
      setIsTxStart={setIsTxStart}
      setError={setError}
      error={error}
      isError={isError}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withoutTryAgainWhenError
      successElement={<TxText formData={formData} />}
      topBlock={
        <ActionModalTitle
          title={
            txSuccess && isTxStart
              ? texts.representationsPage.txSuccess
              : texts.representationsPage.txTitle
          }
        />
      }>
      <ActionModalContentWrapper>
        <TxText formData={formData} isBeforeTx />
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
