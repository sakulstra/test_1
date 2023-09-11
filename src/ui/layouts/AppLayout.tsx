'use client';
import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';

import Web3Provider from '../../web3/components/Web3Provider';
import Web3HelperProvider from '../../web3/providers/Web3HelperProvider';
import { HelpModalProvider } from '../helpModals/HelpModalProvider';
import { MainLayout } from './MainLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Web3Provider />
      <Web3HelperProvider />
      <MainLayout>{children}</MainLayout>

      <HelpModalProvider />
    </>
  );
}
