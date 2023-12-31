import { Box } from '@mui/system';

import { BackButton3D, Divider } from '../../ui';
import { texts } from '../../ui/utils/texts';
import { TransactionUnion } from '../store/transactionsSlice';
import { TransactionInfoItem } from './TransactionInfoItem';

interface TransactionsModalContentProps {
  allTransactions: (TransactionUnion & {
    status?: number | undefined;
    pending: boolean;
  })[];
  onBackButtonClick: () => void;
}

export function TransactionsModalContent({
  allTransactions,
  onBackButtonClick,
}: TransactionsModalContentProps) {
  return (
    <Box>
      <Box
        component="h3"
        sx={{ typography: 'h3', textAlign: 'center', fontWeight: '600' }}>
        {texts.transactions.allTransactions}
      </Box>

      <Divider sx={{ mt: 13, mb: 26 }} />

      <Box sx={{ overflowY: 'scroll', height: 316, pr: 20 }}>
        {allTransactions.map((tx, index) => (
          <TransactionInfoItem key={index} tx={tx} />
        ))}
      </Box>

      <BackButton3D
        isSmall
        alwaysWithBorders
        isVisibleOnMobile
        onClick={onBackButtonClick}
        wrapperCss={{ mt: 40 }}
      />
    </Box>
  );
}
