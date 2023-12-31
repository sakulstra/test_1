import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import LinkIcon from '/public/images/icons/link.svg';

import { selectTxExplorerLink, WalletType } from '../../../lib/web3/src';
import { useStore } from '../../store';
import { BigButton, Link } from '../../ui';
import { RocketLoader } from '../../ui/components/RocketLoader';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import { chainInfoHelper } from '../../utils/chains';

export interface ActionModalContentProps {
  topBlock?: ReactNode;
  setIsOpen: (value: boolean) => void;
  contentMinHeight?: number;
  children: ReactNode;
  txHash?: string;
  txWalletType?: WalletType;
  txPending?: boolean;
  txSuccess?: boolean;
  isTxStart: boolean;
  setIsTxStart: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
  isError?: boolean;
  successElement?: ReactNode;
  closeButtonText?: string;
  withoutTryAgainWhenError?: boolean;
}

export function ActionModalContent({
  topBlock,
  setIsOpen,
  contentMinHeight = 240,
  children,
  txHash,
  txWalletType,
  txPending,
  txSuccess,
  isTxStart,
  setIsTxStart,
  error,
  setError,
  isError,
  successElement,
  closeButtonText,
  withoutTryAgainWhenError,
}: ActionModalContentProps) {
  const theme = useTheme();
  const state = useStore();

  return (
    <>
      {topBlock}

      <Box
        sx={{
          display: 'flex',
          minHeight: contentMinHeight,
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        {isTxStart ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flex: 1,
                py: 20,
                flexDirection: 'column',
              }}>
              {txPending && (
                <Box sx={{ lineHeight: 0, ml: -13 }}>
                  <RocketLoader />
                </Box>
              )}
              <Box
                component="h3"
                sx={{
                  typography: 'h3',
                  mb: 8,
                  fontWeight: 600,
                  color: isError ? '$error' : '$text',
                }}>
                {txPending && texts.transactions.pending}
                {txSuccess && texts.transactions.success}
                {isError && texts.transactions.error}
              </Box>
              <Box sx={{ typography: 'h3' }}>
                {txPending && texts.transactions.pendingDescription}
                {txSuccess && !!successElement
                  ? successElement
                  : txSuccess && texts.transactions.executed}
                {isError && texts.transactions.notExecuted}
              </Box>
              {isError && (
                <Box
                  sx={{
                    typography: 'body',
                    mt: 8,
                    color: '$textSecondary',
                    wordBreak: 'break-all',
                  }}>
                  {error}
                </Box>
              )}
              {txHash && txWalletType && (
                <Box
                  sx={{
                    display: 'flex',
                    mt: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Link
                    href={selectTxExplorerLink(
                      state,
                      chainInfoHelper.getChainParameters,
                      txHash,
                    )}
                    css={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '$textSecondary',
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textSecondary,
                      },
                      hover: {
                        color: theme.palette.$text,
                        path: { stroke: theme.palette.$text },
                      },
                    }}
                    inNewWindow>
                    <Box component="span" sx={{ typography: 'descriptor' }}>
                      {texts.other.viewOnExplorer}
                    </Box>
                    <IconBox
                      sx={{
                        width: 10,
                        height: 10,
                        '> svg': {
                          width: 10,
                          height: 10,
                        },
                        ml: 3,
                        position: 'relative',
                        bottom: 0.5,
                      }}>
                      <LinkIcon />
                    </IconBox>
                  </Link>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {txSuccess && (
                <BigButton alwaysWithBorders onClick={() => setIsOpen(false)}>
                  {closeButtonText || texts.other.close}
                </BigButton>
              )}
              {isError && (
                <>
                  <BigButton
                    alwaysWithBorders
                    color="white"
                    css={{ mr: withoutTryAgainWhenError ? 0 : 20 }}
                    onClick={() => setIsOpen(false)}>
                    {closeButtonText || texts.other.close}
                  </BigButton>
                  {!withoutTryAgainWhenError && (
                    <BigButton
                      alwaysWithBorders
                      onClick={() => {
                        setIsTxStart(false);
                        setError('');
                      }}>
                      {texts.transactions.tryAgain}
                    </BigButton>
                  )}
                </>
              )}
            </Box>
          </>
        ) : (
          <>{children}</>
        )}
      </Box>
    </>
  );
}
