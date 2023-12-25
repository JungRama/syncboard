import FileDetail from './fileDetail';

export const metadata = {
  title: 'Syncboard - Draw or Use AI',
  icons: '/icon/favicon.ico',
};

export default function Page({ params }): JSX.Element {
  return (
    <>
      <FileDetail params={params}></FileDetail>
    </>
  );
}
