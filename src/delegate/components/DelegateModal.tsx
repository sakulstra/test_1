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
import { DelegateData, DelegateItem } from '../types';
import { DelegatedText } from './DelegatedText';

export function DelegateModal({
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
  delegateData,
  formDelegateData,
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
> & { delegateData: DelegateItem[]; formDelegateData: DelegateData[] }) {
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
      successElement={
        <DelegatedText
          delegateData={delegateData}
          formDelegateData={formDelegateData}
        />
      }
      topBlock={
        <ActionModalTitle
          title={
            txSuccess && isTxStart
              ? texts.delegatePage.delegateTxSuccess
              : texts.delegatePage.delegateTxTitle
          }
        />
      }>
      <ActionModalContentWrapper>
        <DelegatedText
          delegateData={delegateData}
          formDelegateData={formDelegateData}
          isBeforeTx
        />
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
