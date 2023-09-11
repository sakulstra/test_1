import { SxProps } from '@mui/system';

import { chainInfoHelper } from '../../utils/chains';
import { Image } from '../primitives/Image';
import { setRelativePath } from '../utils/relativePath';

interface NetworkIconProps {
  chainId: number;
  css?: SxProps;
}

export function NetworkIcon({ chainId, css }: NetworkIconProps) {
  let networkIconName = 'ethereum';
  if (chainId === 11155111 || chainId === 1 || chainId === 5) {
    networkIconName = 'ethereum';
  } else if (chainId === 137 || chainId === 80001) {
    networkIconName = 'polygon';
  } else if (chainId === 43114 || chainId === 43113) {
    networkIconName = 'avalanche';
  } else if (chainId === 97 || chainId === 56) {
    networkIconName = 'bsc';
  }

  return (
    <Image
      sx={{ borderRadius: '50%', width: 16, height: 16, ...css }}
      src={setRelativePath(
        `/images/networks/${networkIconName.toLowerCase()}.svg`,
      )}
      alt={`${chainInfoHelper.getChainParameters(chainId).chainName} icon`}
    />
  );
}
