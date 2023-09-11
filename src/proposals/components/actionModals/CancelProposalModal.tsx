import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function CancelProposalModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const { cancelProposal } = useStore();

  return (
    <ActionModal
      type="cancelProposal"
      payload={{
        proposalId,
      }}
      errorMessage={texts.proposalActions.cancelProposalError}
      callbackFunction={async () => await cancelProposal(proposalId)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle title={texts.proposalActions.cancelProposal} />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.cancelProposalDescription(proposalId)}
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
