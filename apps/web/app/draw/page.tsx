import Draw from './draw';

export const metadata = {
  title: 'Syncboard - Draw or Use AI',
  icons: '/icon/favicon.ico',
};

export default function Page({ params }): JSX.Element {
  return <Draw></Draw>;
}
