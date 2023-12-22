import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Separator } from '@ui/components/ui/separator';
import { Loader, Search } from 'lucide-react';
import Favorites from './favorites';
import Profile from './profile';
import Image from 'next/image';
import { useState } from 'react';
import _ from 'underscore';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const router = useRouter();

  const searchFile = (e) => {
    setSearch(e.target.value);
    setLoadingSearch(true);
    searchDebounce(e.target.value);
  };

  const searchDebounce = _.debounce((value) => {
    router.push(`/files/?search=${value}`);
    setLoadingSearch(false);
  }, 2000);

  return (
    <>
      <div className="my-3 flex justify-center">
        <Button variant="link">
          <Image src={'/logo.svg'} width={130} height={130} alt="logo"></Image>
        </Button>
      </div>
      <Separator />

      <Profile></Profile>

      <div className="relative mx-3 my-4">
        <Search className="absolute left-2 top-[50%] h-4 -translate-y-1/2 transform" />

        <Input
          value={search}
          className="w-full max-w-sm pl-10 text-xs"
          onChange={searchFile}
          placeholder="Search Files ..."
        />

        {loadingSearch && (
          <div className="absolute right-2 top-[50%] -translate-y-1/2 transform ">
            <Loader className="h-4 w-4 animate-spin"></Loader>
          </div>
        )}
      </div>

      <Separator />

      <Favorites></Favorites>
    </>
  );
}
