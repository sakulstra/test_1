import { RepresentationFormData } from '../store/representationsSlice';

interface GetFormRepresentationsDataParams {
  chainId: number;
  representativeAddress?: string;
  representedAddress?: string;
  formData?: RepresentationFormData[];
}

export function getFormRepresentationsData({
  chainId,
  representativeAddress,
  representedAddress,
  formData,
}: GetFormRepresentationsDataParams) {
  const formRepresentationsDataItem =
    !!formData &&
    !!formData.length &&
    formData.find((item) => item.chainId === chainId);

  const formRepresentativeAddress =
    typeof formRepresentationsDataItem !== 'boolean' &&
    typeof formRepresentationsDataItem !== 'undefined'
      ? formRepresentationsDataItem.representative
      : representativeAddress;

  const formRepresentedAddress =
    typeof formRepresentationsDataItem !== 'boolean' &&
    typeof formRepresentationsDataItem !== 'undefined'
      ? formRepresentationsDataItem.represented
      : representedAddress;

  return {
    formRepresentativeAddress,
    formRepresentedAddress,
  };
}
