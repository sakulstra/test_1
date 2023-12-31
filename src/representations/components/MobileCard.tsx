import { Box, useTheme } from '@mui/system';

import { BoxWith3D } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { getChainName } from '../../ui/utils/getChainName';
import { texts } from '../../ui/utils/texts';
import { getFormRepresentationsData } from '../utils/getFormRepresentationsData';
import { RepresentationsTableItemField } from './RepresentationsTableItemField';
import { TableItemProps } from './TableItem';

export function MobileCard({
  representativeAddress,
  representedAddresses,
  representedAddress,
  chainId,
  loading,
  formData,
  isEdit,
  isViewChanges,
  inputName,
}: TableItemProps) {
  const theme = useTheme();

  const { formRepresentativeAddress, formRepresentedAddress } =
    getFormRepresentationsData({
      chainId: chainId || 0,
      representativeAddress,
      representedAddress,
      formData,
    });

  return (
    <Box sx={{ mb: 30 }}>
      <BoxWith3D
        contentColor="$mainLight"
        borderSize={4}
        wrapperCss={{
          mb: 25,
        }}
        css={{
          p: 10,
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!chainId ? (
              <Box sx={{ mr: 20 }}>
                <CustomSkeleton circle width={35} height={35} />
              </Box>
            ) : (
              <NetworkIcon
                chainId={chainId}
                css={{ mr: 20, width: 35, height: 35 }}
              />
            )}
            {!chainId ? (
              <Box sx={{ mb: 4 }}>
                <CustomSkeleton width={30} height={20} />
              </Box>
            ) : (
              <Box component="h2" sx={{ typography: 'h2' }}>
                {getChainName(chainId)}
              </Box>
            )}
          </Box>
        </Box>
      </BoxWith3D>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 25,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Box
          component="h3"
          sx={{
            typography: 'h2',
            [theme.breakpoints.up('sm')]: { flex: 1 },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {texts.representationsPage.tableHeaderRepresented}
        </Box>
        <Box
          sx={{
            display: 'flex',
            minWidth: isEdit ? '100%' : 'unset',
            mt: isEdit ? 10 : 0,
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              minWidth: 350,
              mt: 0,
              flex: 2,
              justifyContent: 'flex-end',
            },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {loading ? (
            <CustomSkeleton width={150} height={18} />
          ) : (
            <RepresentationsTableItemField
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.representative`}
              address={representativeAddress}
              addressTo={formRepresentativeAddress}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Box
          component="h3"
          sx={{
            typography: 'h2',
            [theme.breakpoints.up('sm')]: { flex: 1 },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {texts.representationsPage.tableHeaderRepresenting}
        </Box>
        <Box
          sx={{
            display: 'flex',
            minWidth: isEdit ? '100%' : 'unset',
            mt: isEdit ? 10 : 0,
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              minWidth: 350,
              mt: 0,
              flex: 2,
              justifyContent: 'flex-end',
            },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {loading ? (
            <CustomSkeleton width={150} height={18} />
          ) : (
            <RepresentationsTableItemField
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.represented`}
              address={representedAddress}
              addressTo={formRepresentedAddress}
              selectAddresses={representedAddresses}
              withSelect
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
