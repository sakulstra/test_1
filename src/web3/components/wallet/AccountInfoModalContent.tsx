import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';

import CopyIcon from '/public/images/icons/copy.svg';

import { TransactionInfoItem } from '../../../transactions/components/TransactionInfoItem';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { CopyToClipboard, Divider, Image, Link } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { ROUTES } from '../../../ui/utils/routes';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { chainInfoHelper } from '../../../utils/chains';

interface AccountInfoModalContentProps {
  activeAddress: string;
  chainId: number;
  isActive: boolean;
  allTransactions: (TransactionUnion & {
    status?: number | undefined;
    pending: boolean;
  })[];
  onAllTransactionButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  onDelegateButtonClick: () => void;
  onRepresentationsButtonClick: () => void;
  ensName?: string;
  ensAvatar?: string;
  useBlockie: boolean;
  setUseBlockie: (value: boolean) => void;
  forTest?: boolean;
}

export function AccountInfoModalContent({
  activeAddress,
  chainId,
  isActive,
  allTransactions,
  onAllTransactionButtonClick,
  onDisconnectButtonClick,
  onDelegateButtonClick,
  onRepresentationsButtonClick,
  forTest,
  ensName,
  ensAvatar,
  useBlockie,
  setUseBlockie,
}: AccountInfoModalContentProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const ensNameAbbreviated = ensName
    ? ensName.length > 30
      ? textCenterEllipsis(ensName, 28, 2)
      : ensName
    : undefined;

  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              sx={{ width: 34, height: 34, borderRadius: '50%' }}
            />

            <Box sx={{ display: 'flex', ml: 6, alignItems: 'center' }}>
              <Box component="h3" sx={{ typography: 'h3', fontWeight: '600' }}>
                {ensNameAbbreviated
                  ? ensNameAbbreviated
                  : textCenterEllipsis(activeAddress, sm ? 10 : 6, sm ? 10 : 6)}
              </Box>
              <CopyToClipboard copyText={activeAddress}>
                <IconBox
                  sx={{
                    cursor: 'pointer',
                    width: 15,
                    height: 15,
                    '> svg': {
                      width: 15,
                      height: 15,
                    },
                    ml: 4,
                    path: {
                      transition: 'all 0.2s ease',
                      stroke: theme.palette.$textSecondary,
                    },
                    hover: { path: { stroke: theme.palette.$main } },
                  }}>
                  <CopyIcon />
                </IconBox>
              </CopyToClipboard>
            </Box>
          </Box>

          <Box
            onClick={onDisconnectButtonClick}
            sx={{
              color: '$textSecondary',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'all 0.2s ease',
              hover: { color: theme.palette.$text },
            }}>
            <Box component="p" sx={{ typography: 'descriptor' }}>
              {texts.walletConnect.disconnect}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mt: 12, mb: 16 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {!forTest ? (
            <Link
              href={ROUTES.delegate}
              css={{
                color: '$textSecondary',
                lineHeight: 1,
                hover: { color: theme.palette.$text },
              }}
              onClick={onDelegateButtonClick}>
              <Box component="p" sx={{ typography: 'descriptor' }}>
                {texts.walletConnect.delegations}
              </Box>
            </Link>
          ) : (
            <Box
              component="p"
              sx={{
                typography: 'descriptor',
                color: '$textSecondary',
                cursor: 'pointer',
                lineHeight: 1,
                transition: 'all 0.2s ease',
                hover: { color: theme.palette.$text },
              }}
              onClick={onDelegateButtonClick}>
              {texts.walletConnect.delegations}
            </Box>
          )}

          {!forTest ? (
            <Link
              href={ROUTES.representations}
              css={{
                color: '$textSecondary',
                lineHeight: 1,
                hover: { color: theme.palette.$text },
              }}
              onClick={onRepresentationsButtonClick}>
              <Box component="p" sx={{ typography: 'descriptor' }}>
                {texts.walletConnect.representations}
              </Box>
            </Link>
          ) : (
            <Box
              component="p"
              sx={{
                typography: 'descriptor',
                color: '$textSecondary',
                cursor: 'pointer',
                lineHeight: 1,
                transition: 'all 0.2s ease',
                hover: { color: theme.palette.$text },
              }}
              onClick={onRepresentationsButtonClick}>
              {texts.walletConnect.representations}
            </Box>
          )}

          <Link
            href={`${
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              chainInfoHelper.getChainParameters(chainId).blockExplorerUrls[0]
            }/address/${activeAddress}`}
            css={{
              color: '$textSecondary',
              lineHeight: 1,
              hover: { color: theme.palette.$text },
            }}
            inNewWindow>
            <Box component="p" sx={{ typography: 'descriptor' }}>
              {texts.other.viewOnExplorer}
            </Box>
          </Link>
        </Box>
      </Box>

      {isActive ? (
        <>
          <Box
            sx={{
              display: 'flex',
              mt: 50,
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative',
              pb: 35,
            }}>
            <Box
              component="h3"
              sx={{ typography: 'h3', textAlign: 'center', fontWeight: 600 }}>
              {allTransactions.length >= 2
                ? texts.walletConnect.lastTransaction(allTransactions.length)
                : allTransactions.length === 0
                ? texts.walletConnect.transactions
                : texts.walletConnect.lastTransaction(allTransactions.length)}
            </Box>

            <Divider sx={{ mt: 14, mb: 24, width: '100%' }} />

            {!!allTransactions.length ? (
              <>
                <Box sx={{ height: 230, width: '100%' }}>
                  {allTransactions
                    .filter((tx) => tx.type !== 'delegate')
                    .slice(0, 4)
                    .map((tx, index) => (
                      <TransactionInfoItem key={index} tx={tx} />
                    ))}
                </Box>

                {allTransactions.length > 4 && (
                  <Box
                    component="button"
                    sx={{
                      typography: 'body',
                      position: 'absolute',
                      bottom: 0,
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                      color: '$textSecondary',
                      lineHeight: 1,
                      hover: { color: theme.palette.$text },
                    }}
                    onClick={onAllTransactionButtonClick}>
                    {texts.walletConnect.transactions}
                  </Box>
                )}
              </>
            ) : (
              <Box
                component="p"
                sx={{
                  typography: 'body',
                  color: '$textSecondary',
                  textAlign: 'center',
                }}>
                {texts.walletConnect.transactionsEmpty}
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          component="p"
          sx={{
            mt: 30,
            typography: 'body',
            color: '$textSecondary',
            textAlign: 'center',
          }}>
          {texts.walletConnect.transactionsNoWallet}
        </Box>
      )}
    </>
  );
}
