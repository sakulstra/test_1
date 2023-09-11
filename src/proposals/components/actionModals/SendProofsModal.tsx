import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { texts } from '../../../ui/utils/texts';
import { getTokenName } from '../../../utils/getTokenName';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

interface SendProofsModalProps extends ActionModalBasicTypes {
  blockHash: string;
  underlyingAsset: string;
  votingChainId: number;
  baseBalanceSlotRaw: number;
  withSlot?: boolean;
}

export function SendProofsModal({
  isOpen,
  setIsOpen,
  proposalId,
  votingChainId,
  blockHash,
  underlyingAsset,
  baseBalanceSlotRaw,
  withSlot,
}: SendProofsModalProps) {
  const sendProofs = useStore((state) => state.sendProofs);

  return (
    <ActionModal
      type="sendProofs"
      payload={{ proposalId, blockHash, underlyingAsset, withSlot }}
      errorMessage={texts.proposalActions.sendProofsError}
      callbackFunction={async () =>
        await sendProofs(
          votingChainId,
          proposalId,
          underlyingAsset,
          baseBalanceSlotRaw,
          withSlot,
        )
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle
          title={`Send ${getTokenName(underlyingAsset)} ${
            withSlot ? 'slot' : 'proof'
          }`}
        />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {withSlot ? 'Slot' : 'Proof'} will be send
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}