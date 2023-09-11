import React, { useEffect } from 'react';

import { BasicModal } from '../../ui';
import {
  ActionModalContent,
  ActionModalContentProps,
} from './ActionModalContent';

export interface BasicActionModalProps extends ActionModalContentProps {
  isOpen: boolean;
}

export function BasicActionModal({
  isOpen,
  setIsOpen,
  topBlock,
  contentMinHeight,
  children,
  txHash,
  txPending,
  txSuccess,
  isTxStart,
  setIsTxStart,
  isError,
  error,
  setError,
  successElement,
  txWalletType,
  withoutTryAgainWhenError,
}: BasicActionModalProps) {
  useEffect(() => {
    setIsTxStart(false);
    setError('');
  }, [isOpen]);

  return (
    <BasicModal isOpen={isOpen} setIsOpen={setIsOpen} withCloseButton>
      <ActionModalContent
        topBlock={topBlock}
        setIsOpen={setIsOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        isError={isError}
        error={error}
        setError={setError}
        contentMinHeight={contentMinHeight}
        successElement={successElement}
        txSuccess={txSuccess}
        txHash={txHash}
        txPending={txPending}
        txWalletType={txWalletType}
        withoutTryAgainWhenError={withoutTryAgainWhenError}>
        {children}
      </ActionModalContent>
    </BasicModal>
  );
}
