import React from 'react';

import { selectAllTransactionsByWallet } from '../../../lib/web3/src';
import { useStore } from '../../store';
import { BasicModal } from '../../ui';
import { TransactionUnion } from '../store/transactionsSlice';
import { TransactionsModalContent } from './TransactionsModalContent';

interface TransactionsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function TransactionsModal({
  isOpen,
  setIsOpen,
}: TransactionsModalProps) {
  const { getActiveAddress, setAccountInfoModalOpen } = useStore();
  const activeAddress = getActiveAddress() || '';

  const allTransactions = useStore((state) =>
    selectAllTransactionsByWallet<TransactionUnion>(state, activeAddress),
  );

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withoutAnimationWhenOpen>
      <TransactionsModalContent
        allTransactions={allTransactions.sort(
          (a, b) => b.localTimestamp - a.localTimestamp,
        )}
        onBackButtonClick={() => {
          setIsOpen(false);
          setAccountInfoModalOpen(true);
        }}
      />
    </BasicModal>
  );
}
