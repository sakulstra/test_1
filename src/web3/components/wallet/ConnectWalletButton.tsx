import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React, { useEffect, useState } from 'react';

import SuccessIcon from '/public/images/icons/check.svg';
import ErrorIcon from '/public/images/icons/cross.svg';

import {
  LocalStorageKeys,
  selectAllTransactions,
  selectPendingTransactions,
  WalletType,
} from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { Image, Spinner } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { IconBox } from '../../../ui/primitives/IconBox';
import { getChainName } from '../../../ui/utils/getChainName';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { appConfig } from '../../../utils/appConfig';
import { selectActiveWallet } from '../../store/web3Selectors';

interface ConnectWalletButtonProps {
  onClick: () => void;
  ensName?: string;
  ensAvatar?: string;
  useBlockie: boolean;
  setUseBlockie: (value: boolean) => void;
}

export function ConnectWalletButton({
  onClick,
  ensName,
  ensAvatar,
  useBlockie,
  setUseBlockie,
}: ConnectWalletButtonProps) {
  const theme = useTheme();
  const lg = useMediaQuery(media.lg);
  const [loading, setLoading] = useState(true);

  const walletActivating = useStore((state) => state.walletActivating);
  const getActiveAddress = useStore((state) => state.getActiveAddress);
  const allTransactions = useStore((state) => selectAllTransactions(state));
  const allPendingTransactions = useStore((state) =>
    selectPendingTransactions(state),
  );
  const activeWallet = useStore(selectActiveWallet);

  const isActive = activeWallet?.isActive;
  const activeAddress = getActiveAddress() || '';
  const lastTransaction = allTransactions[allTransactions.length - 1];

  const ensNameAbbreviated = ensName
    ? ensName.length > 11
      ? textCenterEllipsis(ensName, 6, 2)
      : ensName
    : undefined;

  const [lastTransactionSuccess, setLastTransactionSuccess] = useState(false);
  const [lastTransactionError, setLastTransactionError] = useState(false);

  useEffect(() => {
    if (lastTransaction?.status && activeWallet) {
      if (lastTransaction.status === 1) {
        setLastTransactionSuccess(true);
        setTimeout(() => setLastTransactionSuccess(false), 1000);
      } else if (lastTransaction.status === 0) {
        setLastTransactionError(true);
        setTimeout(() => setLastTransactionError(false), 1000);
      }
    }
  }, [lastTransaction]);

  const lastConnectedWallet =
    typeof localStorage !== 'undefined' &&
    (localStorage.getItem(LocalStorageKeys.LastConnectedWallet) as
      | WalletType
      | undefined);

  useEffect(() => {
    if (!!lastConnectedWallet || !activeWallet) {
      setLoading(false);
    }
  }, [lastConnectedWallet]);

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              '.react-loading-skeleton': { width: 110, height: 23 },
              [theme.breakpoints.up('lg')]: {
                '.react-loading-skeleton': { width: 140, height: 33 },
              },
            }}>
            <CustomSkeleton />
          </Box>
        </>
      ) : (
        <>
          {!isActive ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: 110,
                height: 24,
                backgroundColor: '$textLight',
                transition: 'all 0.2s ease',
                color: '$mainStable',
                hover: {
                  color: theme.palette.$text,
                  backgroundColor: theme.palette.$middleLight,
                },
                '&:active': {
                  backgroundColor: '$middleLight',
                },
                '&:disabled': {
                  cursor: 'not-allowed',
                  backgroundColor: '$textLight',
                  color: '$mainStable',
                },
                [theme.breakpoints.up('lg')]: {
                  width: 140,
                  height: 34,
                },
              }}
              component="button"
              type="button"
              disabled={walletActivating}
              onClick={onClick}>
              <Box
                component="p"
                sx={{
                  typography: 'buttonSmall',
                }}>
                {walletActivating
                  ? texts.walletConnect.connectButtonConnecting
                  : texts.walletConnect.connectButtonConnect}
              </Box>
              {walletActivating && (
                <Box
                  sx={{
                    backgroundColor: '$textLight',
                    ml: 5,
                    position: 'relative',
                    top: 0.5,
                  }}>
                  <Spinner
                    size={16}
                    loaderLineColor="$textLight"
                    loaderCss={{ backgroundColor: '$mainStable' }}
                    lineSize={2}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'none',
                  [theme.breakpoints.up('sm')]: { display: 'flex', mr: 10 },
                  [theme.breakpoints.up('lg')]: {
                    mr: 20,
                  },
                }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    mr: 4,
                    backgroundColor: '$textLight',
                    [theme.breakpoints.up('lg')]: {
                      width: 9,
                      height: 9,
                    },
                  }}
                />
                <Box
                  component="p"
                  sx={{
                    typography: 'buttonSmall',
                    color: '$textLight',
                  }}>
                  {getChainName(
                    activeWallet?.chainId || appConfig.govCoreChainId,
                  )}
                </Box>
              </Box>

              <Box
                component="button"
                type="button"
                onClick={onClick}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 8,
                  cursor: 'pointer',
                  minWidth: 110,
                  height: 25,
                  backgroundColor: lastTransactionError
                    ? '$error'
                    : lastTransactionSuccess
                    ? '$mainFor'
                    : '$textLight',
                  transition: 'all 0.2s ease',
                  color: '$mainStable',
                  hover: {
                    color: theme.palette.$text,
                    backgroundColor: lastTransactionError
                      ? theme.palette.$error
                      : lastTransactionSuccess
                      ? theme.palette.$mainFor
                      : theme.palette.$middleLight,
                    '.ConnectWalletButton__text': {
                      color:
                        !lastTransactionError && !lastTransactionSuccess
                          ? theme.palette.$text
                          : theme.palette.$textWhite,
                    },
                  },
                  '&:active': {
                    backgroundColor: lastTransactionError
                      ? '$error'
                      : lastTransactionSuccess
                      ? '$mainFor'
                      : '$middleLight',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                    backgroundColor: '$textLight',
                    color: '$mainStable',
                  },
                  [theme.breakpoints.up('lg')]: {
                    minWidth: 140,
                    height: 34,
                  },
                }}>
                {lastTransactionError && (
                  <IconBox
                    sx={{
                      position: 'relative',
                      zIndex: 5,
                      width: 13,
                      height: 13,
                      '> svg': {
                        width: 13,
                        height: 13,
                      },
                      mr: 5,
                      path: { stroke: theme.palette.$textWhite },
                    }}>
                    <ErrorIcon />
                  </IconBox>
                )}
                {lastTransactionSuccess && (
                  <IconBox
                    sx={{
                      position: 'relative',
                      zIndex: 5,
                      width: 15,
                      height: 15,
                      '> svg': {
                        width: 15,
                        height: 15,
                      },
                      mr: 5,
                      path: { stroke: theme.palette.$textWhite },
                    }}>
                    <SuccessIcon />
                  </IconBox>
                )}

                <Box
                  className="ConnectWalletButton__text"
                  sx={{
                    typography: 'buttonSmall',
                    flex: 1,
                    alignSelf: 'center',
                    color: lastTransactionError
                      ? '$textWhite'
                      : lastTransactionSuccess
                      ? '$textWhite'
                      : '$mainStable',
                  }}>
                  {lastTransactionError
                    ? 'Error'
                    : lastTransactionSuccess
                    ? 'Success'
                    : ensNameAbbreviated
                    ? ensNameAbbreviated
                    : textCenterEllipsis(activeAddress, 4, 4)}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 22,
                    width: 22,
                    background: 'inherit',
                    backgroundImage: 'inherit',
                    borderRadius: '50%',
                    [theme.breakpoints.up('lg')]: {
                      height: 26,
                      width: 26,
                    },
                  }}>
                  {!!allPendingTransactions.length && (
                    <Spinner
                      size={lg ? 26 : 22}
                      loaderLineColor="$textLight"
                      loaderCss={{ backgroundColor: '$mainStable' }}
                      css={{ position: 'absolute' }}
                    />
                  )}
                  <Image
                    src={
                      useBlockie
                        ? makeBlockie(
                            activeAddress !== '' ? activeAddress : 'default',
                          )
                        : ensAvatar
                    }
                    alt=""
                    onError={() => setUseBlockie(true)}
                    sx={{
                      height: 16,
                      width: 16,
                      borderRadius: '50%',
                      [theme.breakpoints.up('lg')]: {
                        height: 20,
                        width: 20,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
