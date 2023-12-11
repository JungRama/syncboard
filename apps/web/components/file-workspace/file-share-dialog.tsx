import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Link, ShareIcon } from 'lucide-react';

import { GetFileByIdQuery } from '@/codegen/graphql';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import FileUserOwner from './file-user-owner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index.store';

export default function FileShareDialog({
  users,
}: {
  users: GetFileByIdQuery['getFileById']['userAccess'];
}) {
  const userData = useSelector((state: RootState) => state.user?.user);

  const isCurrentUserFileOwner =
    users.find((item) => item.userId._id === userData?.id)?.role === 'OWNER';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2" variant={'secondary'}>
          <ShareIcon className="h-4"></ShareIcon>
          <p>Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input placeholder="Enter email" type="email"></Input>
          <Select value="view">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">Can View</SelectItem>
              <SelectItem value="edit">Can Edit</SelectItem>
            </SelectContent>
          </Select>
          <Button>Invite</Button>
        </div>
        <hr className="border-gray-200" />
        {users.map((item) => {
          const user = item.userId;
          return (
            <div className="flex items-center justify-between" key={user?._id}>
              <div className="flex items-center gap-2">
                <FileUserOwner
                  name={user.name}
                  photo={user.photo}
                  withTooltip={false}
                ></FileUserOwner>
                <div className="flex flex-col">
                  <p className="text-sm">Jung Rama</p>
                  <p className="text-xs text-muted-foreground">Owner</p>
                </div>
              </div>
              <div>
                <Select
                  value={item.role}
                  disabled={!isCurrentUserFileOwner || item.role === 'OWNER'}
                >
                  <SelectTrigger className="border-0 p-0 shadow-none focus:border-0 focus:outline-none">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="VIEW">Can View</SelectItem>
                    <SelectItem value="EDIT">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
        <hr className="border-gray-200" />
        <div className="flex w-[90px] cursor-pointer text-xs font-medium text-blue-700">
          <Link className="h-4"></Link> Copy Link
        </div>
      </DialogContent>
    </Dialog>
  );
}
