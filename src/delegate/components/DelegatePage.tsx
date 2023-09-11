'use client';

import { Box } from '@mui/system';
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
import { DelegateData, DelegateItem } from '../types';
import { DelegateModal } from './DelegateModal';
import { DelegateTableWrapper } from './DelegateTableWrapper';

export function DelegatePage() {
  const router = useRouter();

  const {
    activeWallet,
    delegateData,
    getDelegateData,
    isDelegateModalOpen,
    setDelegateModalOpen,
    setConnectWalletModalOpen,
    isDelegateChangedView,
    setIsDelegateChangedView,
    delegate,
  } = useStore();

  const [isEdit, setIsEdit] = useState(false);
  const [formDelegateData, setFormDelegateData] = useState<DelegateData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stateDelegateData, setStateDelegateData] = useState<DelegateItem[]>(
    [],
  );

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
    type: 'delegate',
    payload: {
      delegateData: stateDelegateData,
      formDelegateData,
    },
  });

  useEffect(() => {
    getDelegateData();
    setIsEdit(false);
    setIsDelegateChangedView(false);
  }, [activeWallet?.accounts[0]]);

  useEffect(() => {
    if (!!delegateData.length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [delegateData.length]);

  useEffect(() => {
    setFormDelegateData(
      delegateData.map((data) => {
        return {
          underlyingAsset: data.underlyingAsset,
          votingToAddress: data.votingToAddress,
          propositionToAddress: data.propositionToAddress,
        };
      }),
    );
  }, [activeWallet?.accounts[0], delegateData]);

  const handleFormSubmit = ({
    formDelegateData,
  }: {
    formDelegateData: DelegateData[];
  }) => {
    const formattedFormData = formDelegateData.map((data) => {
      return {
        underlyingAsset: data.underlyingAsset,
        votingToAddress:
          data.votingToAddress === undefined ? '' : data.votingToAddress,
        propositionToAddress:
          data.propositionToAddress === undefined
            ? ''
            : data.propositionToAddress,
      };
    });

    setFormDelegateData(formattedFormData);
    setIsEdit(false);
    setIsDelegateChangedView(true);
  };

  const handleDelegate = async () => {
    setError('');
    setLoading(true);
    setDelegateModalOpen(true);
    setStateDelegateData(delegateData);
    try {
      await delegate(formDelegateData);
    } catch (e) {
      console.log(e);
      setError(texts.delegatePage.delegateTxError);
    }
    setLoading(false);
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
            {!isEdit && isDelegateChangedView && (
              <DelegateTableWrapper
                loading={loadingData}
                delegateData={delegateData}
                isEdit={isEdit}
                isViewChanges={isDelegateChangedView}
                formDelegateData={formDelegateData}>
                <BigButton
                  color="white"
                  css={{ mr: 24 }}
                  onClick={() => {
                    setFormDelegateData(
                      delegateData.map((data) => {
                        return {
                          underlyingAsset: data.underlyingAsset,
                          votingToAddress: data.votingToAddress,
                          propositionToAddress: data.propositionToAddress,
                        };
                      }),
                    );
                    setIsDelegateChangedView(false);
                  }}>
                  {texts.other.cancel}
                </BigButton>
                <BigButton
                  onClick={handleDelegate}
                  loading={loading}
                  disabled={isEqual(
                    delegateData.map((data) => {
                      return {
                        underlyingAsset: data.underlyingAsset,
                        votingToAddress: data.votingToAddress,
                        propositionToAddress: data.propositionToAddress,
                      };
                    }),
                    formDelegateData,
                  )}>
                  {texts.other.confirm}
                </BigButton>
              </DelegateTableWrapper>
            )}
            {isEdit && !isDelegateChangedView && (
              <Form<{ formDelegateData: DelegateData[] }>
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={handleFormSubmit}
                initialValues={{
                  formDelegateData: formDelegateData,
                }}>
                {({ handleSubmit, values }) => (
                  <DelegateTableWrapper
                    loading={loadingData}
                    delegateData={delegateData}
                    isEdit={isEdit}
                    isViewChanges={isDelegateChangedView}
                    formDelegateData={formDelegateData}
                    handleFormSubmit={handleSubmit}>
                    <BigButton
                      color="white"
                      css={{ mr: 24 }}
                      onClick={() => {
                        setFormDelegateData(
                          delegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress: data.votingToAddress,
                              propositionToAddress: data.propositionToAddress,
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
                        formDelegateData,
                        values.formDelegateData.map((data) => {
                          return {
                            underlyingAsset: data.underlyingAsset,
                            votingToAddress:
                              data.votingToAddress === undefined
                                ? ''
                                : data.votingToAddress,
                            propositionToAddress:
                              data.propositionToAddress === undefined
                                ? ''
                                : data.propositionToAddress,
                          };
                        }),
                      )}>
                      {texts.delegatePage.viewChanges}
                    </BigButton>
                  </DelegateTableWrapper>
                )}
              </Form>
            )}
            {!isEdit && !isDelegateChangedView && (
              <DelegateTableWrapper
                loading={loadingData}
                delegateData={delegateData}
                isEdit={isEdit}
                isViewChanges={isDelegateChangedView}>
                {loadingData ? (
                  <CustomSkeleton width={156} height={50} />
                ) : (
                  <BigButton onClick={() => setIsEdit(true)}>
                    {texts.other.edit}
                  </BigButton>
                )}
              </DelegateTableWrapper>
            )}
          </>
        ) : (
          <NoDataWrapper>
            <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
              {texts.delegatePage.notConnectedWallet}
            </Box>
            <Box
              component="p"
              sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
              {texts.delegatePage.notConnectedWalletDescription}
            </Box>

            <BigButton onClick={() => setConnectWalletModalOpen(true)}>
              {texts.delegatePage.notConnectedWalletButtonTitle}
            </BigButton>
          </NoDataWrapper>
        )}
      </Container>

      {!!formDelegateData.length && (
        <DelegateModal
          isOpen={isDelegateModalOpen}
          setIsOpen={setDelegateModalOpen}
          delegateData={stateDelegateData}
          formDelegateData={formDelegateData}
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
