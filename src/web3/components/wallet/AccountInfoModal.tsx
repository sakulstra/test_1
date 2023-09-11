import React from 'react';

import { selectAllTransactionsByWallet } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { BasicModal } from '../../../ui';
import { appConfig } from '../../../utils/appConfig';
import { AccountInfoModalContent } from './AccountInfoModalContent';

interface AccountInfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setAllTransactionModalOpen: (value: boolean) => void;
  ensName?: string;
  ensAvatar?: string;
  useBlockie: boolean;
  setUseBlockie: (value: boolean) => void;
}

export function AccountInfoModal({
  isOpen,
  setIsOpen,
  setAllTransactionModalOpen,
  ensName,
  ensAvatar,
  useBlockie,
  setUseBlockie,
}: AccountInfoModalProps) {
  const activeWallet = useStore((state) => state.activeWallet);
  const getActiveAddress = useStore((state) => state.getActiveAddress);
  const disconnectActiveWallet = useStore(
    (state) => state.disconnectActiveWallet,
  );
  const activeAddress = getActiveAddress() || '';
  const allTransactions = useStore((state) =>
    selectAllTransactionsByWallet<TransactionUnion>(state, activeAddress),
  );
  const setModalOpen = useStore((state) => state.setModalOpen);

  const handleDisconnectClick = async () => {
    await disconnectActiveWallet();
    setIsOpen(false);
    setModalOpen(false);
  };

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withoutAnimationWhenOpen>
      <AccountInfoModalContent
        ensName={ensName}
        ensAvatar={ensAvatar}
        useBlockie={useBlockie}
        setUseBlockie={setUseBlockie}
        activeAddress={activeAddress}
        chainId={activeWallet?.chainId || appConfig.govCoreChainId}
        isActive={activeWallet?.isActive || false}
        allTransactions={allTransactions.sort(
          (a, b) => b.localTimestamp - a.localTimestamp,
        )}
        onDelegateButtonClick={() => setIsOpen(false)}
        onRepresentationsButtonClick={() => setIsOpen(false)}
        onDisconnectButtonClick={handleDisconnectClick}
        onAllTransactionButtonClick={() => {
          setIsOpen(false);
          setAllTransactionModalOpen(true);
        }}
      />
    </BasicModal>
  );
}
