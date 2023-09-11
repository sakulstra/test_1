'use client';

import { Box } from '@mui/system';
import dayjs from 'dayjs';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { BackButton3D, BigButton, Container } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NoDataWrapper } from '../../ui/components/NoDataWrapper';
import { texts } from '../../ui/utils/texts';
import { RepresentationFormData } from '../store/representationsSlice';
import { RepresentationsModal } from './RepresentationsModal';
import { RepresentationsTableWrapper } from './RepresentationsTableWrapper';

export function RepresentationsPage() {
  const router = useRouter();

  const {
    setConnectWalletModalOpen,
    activeWallet,
    setIsRepresentationsChangedView,
    isRepresentationsChangedView,
    representationData,
    updateRepresentatives,
    isRepresentationsModalOpen,
    setRepresentationsModalOpen,
    representingAddress,
    setRepresentingAddress,
    resetL1Balances,
  } = useStore();

  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<RepresentationFormData[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<
    RepresentationFormData[]
  >([]);
  const [timestampTx] = useState(dayjs().unix());

  useEffect(() => {
    setIsEdit(false);
    setIsRepresentationsChangedView(false);
  }, [activeWallet?.accounts[0]]);

  useEffect(() => {
    if (!!Object.keys(representationData).length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [Object.keys(representationData).length]);

  useEffect(() => {
    setFormData(
      Object.entries(representationData).map((data) => {
        return {
          chainId: +data[0],
          representative: data[1].representative,
          represented: representingAddress[+data[0]] || '',
        };
      }),
    );
  }, [activeWallet?.accounts[0], representationData]);

  const {
    error,
    setError,
    loading,
    setLoading,
    isTxStart,
    txHash,
    txPending,
    txSuccess,
    setIsTxStart,
    isError,
    txWalletType,
  } = useLastTxLocalStatus({
    type: 'representations',
    payload: {
      data: submittedFormData,
      timestamp: timestampTx,
    },
  });

  const handleFormSubmit = ({
    formData,
  }: {
    formData: RepresentationFormData[];
  }) => {
    setFormData(formData);
    setSubmittedFormData(formData);
    setIsEdit(false);
    setIsRepresentationsChangedView(true);
  };

  const handleRepresent = async () => {
    setError('');
    setLoading(true);
    setRepresentationsModalOpen(true);
    try {
      if (!!submittedFormData.length) {
        await updateRepresentatives(submittedFormData, timestampTx);
      }
    } catch (e) {
      console.log(e);
      setError(texts.representationsPage.txError);
    }
    setLoading(false);
  };

  const handleSelect = () => {
    formData.forEach((item) => {
      setRepresentingAddress(item.represented, item.chainId);
    });
  };

  return (
    <>
      <Container>
        <Box sx={{ mb: 12 }}>
          <BackButton3D onClick={router.back} isVisibleOnMobile />
        </Box>
      </Container>

      <Container>
        {activeWallet?.isActive ? (
          <>
            {!isEdit && isRepresentationsChangedView && (
              <RepresentationsTableWrapper
                loading={loadingData}
                representationData={representationData}
                isEdit={isEdit}
                isViewChanges={isRepresentationsChangedView}
                formData={formData}>
                <BigButton
                  color="white"
                  css={{ mr: 24 }}
                  onClick={() => {
                    setFormData(
                      Object.entries(representationData).map((data) => {
                        return {
                          chainId: +data[0],
                          representative: data[1].representative,
                          represented: representingAddress[+data[0]] || '',
                        };
                      }),
                    );
                    setIsRepresentationsChangedView(false);
                  }}>
                  {texts.other.cancel}
                </BigButton>
                <BigButton
                  onClick={() => {
                    handleSelect();
                    if (
                      isEqual(
                        Object.entries(representationData).map((data) => {
                          return {
                            chainId: +data[0],
                            representative: data[1].representative,
                          };
                        }),
                        formData.map((item) => {
                          return {
                            chainId: item.chainId,
                            representative: item.representative,
                          };
                        }),
                      )
                    ) {
                      setIsEdit(false);
                      setIsRepresentationsChangedView(false);
                      resetL1Balances();
                    } else {
                      handleRepresent();
                    }
                  }}
                  loading={loading || txPending}
                  disabled={
                    loading ||
                    txPending ||
                    isEqual(
                      Object.entries(representationData).map((data) => {
                        return {
                          chainId: +data[0],
                          representative: data[1].representative,
                          represented: representingAddress[+data[0]] || '',
                        };
                      }),
                      formData,
                    )
                  }>
                  {texts.other.confirm}
                </BigButton>
              </RepresentationsTableWrapper>
            )}
            {isEdit && !isRepresentationsChangedView && (
              <Form<{ formData: RepresentationFormData[] }>
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={handleFormSubmit}
                initialValues={{
                  formData: formData,
                }}>
                {({ handleSubmit, values }) => (
                  <RepresentationsTableWrapper
                    loading={loadingData}
                    representationData={representationData}
                    isEdit={isEdit}
                    isViewChanges={isRepresentationsChangedView}
                    formData={formData}
                    handleFormSubmit={handleSubmit}>
                    <BigButton
                      color="white"
                      css={{ mr: 24 }}
                      onClick={() => {
                        setFormData(
                          Object.entries(representationData).map((data) => {
                            return {
                              chainId: +data[0],
                              representative: data[1].representative,
                              represented: representingAddress[+data[0]] || '',
                            };
                          }),
                        );
                        setIsEdit(false);
                      }}>
                      {texts.other.close}
                    </BigButton>
                    <BigButton
                      type="submit"
                      disabled={isEqual(
                        formData,
                        values.formData.map((data) => {
                          return {
                            chainId: data.chainId,
                            representative: data.representative,
                            represented: data.represented,
                          };
                        }),
                      )}>
                      {texts.other.paginationNext}
                    </BigButton>
                  </RepresentationsTableWrapper>
                )}
              </Form>
            )}
            {!isEdit && !isRepresentationsChangedView && (
              <RepresentationsTableWrapper
                loading={loadingData}
                representationData={representationData}
                isEdit={isEdit}
                isViewChanges={isRepresentationsChangedView}>
                {loadingData ? (
                  <CustomSkeleton width={156} height={50} />
                ) : (
                  <BigButton onClick={() => setIsEdit(true)}>
                    {texts.other.edit}
                  </BigButton>
                )}
              </RepresentationsTableWrapper>
            )}
          </>
        ) : (
          <NoDataWrapper>
            <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
              {texts.representationsPage.notConnectedWallet}
            </Box>
            <Box
              component="p"
              sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
              {texts.representationsPage.notConnectedWalletDescription}
            </Box>

            <BigButton onClick={() => setConnectWalletModalOpen(true)}>
              {texts.representationsPage.notConnectedWalletButtonTitle}
            </BigButton>
          </NoDataWrapper>
        )}
      </Container>

      {!!submittedFormData.length && (
        <RepresentationsModal
          isOpen={isRepresentationsModalOpen}
          setIsOpen={setRepresentationsModalOpen}
          formData={submittedFormData}
          error={error}
          setError={setError}
          isTxStart={isTxStart}
          setIsTxStart={setIsTxStart}
          txWalletType={txWalletType}
          txSuccess={txSuccess}
          txHash={txHash}
          txPending={txPending}
          isError={isError}
        />
      )}
    </>
  );
}
