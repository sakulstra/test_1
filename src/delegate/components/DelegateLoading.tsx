'use client';

import { Box } from '@mui/system';
import React from 'react';

import { BackButton3D, Container } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { DelegateTableWrapper } from './DelegateTableWrapper';

export function DelegateLoading() {
  return (
    <>
      <Container>
        <Box sx={{ mb: 12 }}>
          <BackButton3D
            isVisibleOnMobile
            onClick={() => console.info('loading')}
          />
        </Box>
      </Container>

      <Container>
        <DelegateTableWrapper
          loading={true}
          delegateData={[]}
          isEdit={false}
          isViewChanges={false}>
          <CustomSkeleton width={156} height={50} />
        </DelegateTableWrapper>
      </Container>
    </>
  );
}
