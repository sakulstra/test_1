import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { getChainName } from '../../ui/utils/getChainName';
import { RepresentationFormData } from '../store/representationsSlice';
import { getFormRepresentationsData } from '../utils/getFormRepresentationsData';
import { RepresentationsTableItemField } from './RepresentationsTableItemField';

export interface TableItemProps {
  representativeAddress?: string;
  representedAddresses?: string[];
  representedAddress?: string;
  chainId?: number;
  loading?: boolean;
  isEdit?: boolean;
  isViewChanges?: boolean;
  formData?: RepresentationFormData[];
  inputName?: string;
}

export function TableItem({
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
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            height: 85,
          },
          [theme.breakpoints.up('md')]: {
            height: 110,
          },
          [theme.breakpoints.up('lg')]: {
            height: 115,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            maxWidth: 180,
            minWidth: 180,
            [theme.breakpoints.up('lg')]: { maxWidth: 250, minWidth: 250 },
          }}>
          {!chainId ? (
            <Box sx={{ mr: 20 }}>
              <CustomSkeleton circle width={35} height={35} />
            </Box>
          ) : (
            <NetworkIcon
              chainId={chainId}
              css={{ mr: 12, width: 35, height: 35 }}
            />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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

        <Box sx={{ display: 'flex', flex: 2, justifyContent: 'center', pr: 7 }}>
          {loading ? (
            <CustomSkeleton width={150} height={20} />
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

        <Box sx={{ display: 'flex', flex: 2, justifyContent: 'center', pl: 7 }}>
          {loading && !representedAddresses?.length ? (
            <CustomSkeleton width={150} height={20} />
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
      <Divider />
    </Box>
  );
}
