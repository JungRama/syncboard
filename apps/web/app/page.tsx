import { Metadata } from 'next';
import PageWrapper from './pageWrapper';

export const metadata: Metadata = {
  icons: '/icon/favicon.ico',
};

export default function Page(): JSX.Element {
  return (
    <>
      <PageWrapper></PageWrapper>
    </>
  );
}
