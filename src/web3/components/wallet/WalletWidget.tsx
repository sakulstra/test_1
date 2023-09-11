import { useEffect, useState } from 'react';

import { useStore } from '../../../store';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { selectActiveWallet } from '../../store/web3Selectors';
import { useGetEns } from '../../utils/use-get-ens';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';

export function WalletWidget() {
  const activeWallet = useStore(selectActiveWallet);
  const {
    connectWalletModalOpen,
    setConnectWalletModalOpen,
    accountInfoModalOpen,
    setAccountInfoModalOpen,
    allTransactionModalOpen,
    setAllTransactionModalOpen,
    resetWalletConnectionError,
    getActiveAddress,
  } = useStore();

  const activeAddress = getActiveAddress() || '';
  const { name: ensName, avatar: ensAvatar } = useGetEns(activeAddress);
  const [useBlockie, setUseBlockie] = useState(false);

  useEffect(() => {
    if (ensAvatar) {
      setUseBlockie(false);
    }
  }, [ensAvatar]);

  useEffect(() => {
    resetWalletConnectionError();
  }, [connectWalletModalOpen]);

  const handleButtonClick = () => {
    if (activeWallet?.isActive) {
      setAccountInfoModalOpen(true);
    } else {
      setConnectWalletModalOpen(true);
    }
  };

  return (
    <>
      <ConnectWalletButton
        ensName={ensName}
        ensAvatar={ensAvatar}
        useBlockie={useBlockie}
        setUseBlockie={setUseBlockie}
        onClick={handleButtonClick}
      />

      <ConnectWalletModal
        isOpen={connectWalletModalOpen}
        setIsOpen={setConnectWalletModalOpen}
      />
      <AccountInfoModal
        ensName={ensName}
        ensAvatar={ensAvatar}
        useBlockie={useBlockie}
        setUseBlockie={setUseBlockie}
        isOpen={accountInfoModalOpen}
        setIsOpen={setAccountInfoModalOpen}
        setAllTransactionModalOpen={setAllTransactionModalOpen}
      />
      <TransactionsModal
        isOpen={allTransactionModalOpen}
        setIsOpen={setAllTransactionModalOpen}
      />
    </>
  );
}
