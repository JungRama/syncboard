import '@ui/styles/globals.css';

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });
import './index.scss';
import MainProvider from '@/providers/index.provider';

export const metadata: Metadata = {
  title: 'Syncboard - Collaborative Whiteboard',
  icons: '/icon/favicon.ico',
  description:
    'Collaborate with team in one simple board. Generate any diagram with the help of AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
