'use client';

import ApolloClientProvider from '@/providers/apollo.provider';
import { Next13ProgressBar } from 'next13-progressbar';

import { store } from '@/store/index.store';
import { Provider as ReduxProvider } from 'react-redux';

import { Toaster } from '@ui/components/ui/toaster';

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Next13ProgressBar
        height="2px"
        color="#000000"
        options={{ showSpinner: true }}
        showOnShallow
      />
      <ReduxProvider store={store}>
        <ApolloClientProvider>
          {children}
          <Toaster></Toaster>
        </ApolloClientProvider>
      </ReduxProvider>
    </>
  );
}
