import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Link, Loader, ShareIcon } from 'lucide-react';

import { GetFileByIdQuery } from '@/codegen/graphql';
import {
  mutateAddNewUserAccess,
  mutateChangeUserAccess,
} from '@/services/file.service';
import { RootState } from '@/store/index.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/components/ui/form';

import { useToast } from '@ui/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FileUserOwner from './file-user-owner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewUserValidationSchema } from '@/validations/file.validation';

export default function FileShareDialog({
  roomId,
  users,
  onUserAccessChange,
}: {
  roomId: string;
  users: GetFileByIdQuery['getFileById']['userAccess'];
  onUserAccessChange: (users: any) => void;
}) {
  const { toast } = useToast();

  const [dialog, setDialog] = useState(false);
  const [idUserChange, setIdUserChange] = useState<string | null>(null);

  const userData = useSelector((state: RootState) => state.user?.user);

  const isCurrentUserFileOwner =
    users.find((item) => item.userId._id === userData?.id)?.role === 'OWNER';

  const [addNewUserAccess, { loading, error }] = mutateAddNewUserAccess();
  const [changeUserAccess, { loading: loadingChangeUserAccess }] =
    mutateChangeUserAccess();

  const formHandler = useForm<z.infer<typeof addNewUserValidationSchema>>({
    resolver: zodResolver(addNewUserValidationSchema),
    defaultValues: {
      role: 'VIEW',
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error]);

  useEffect(() => {
    if (!dialog) {
      formHandler.reset();
    }
  }, [dialog]);

  const submitNewUserAccess = async (data) => {
    const isUserAlreadyExist = users.find(
      (item) => item.userId.email === data.email,
    );

    if (isUserAlreadyExist) {
      toast({
        title: 'Error',
        description: 'User already have access',
        variant: 'destructive',
      });
      return;
    }

    const response = await addNewUserAccess({
      variables: {
        input: {
          id: roomId,
          email: data.email,
          role: data.role,
        },
      },
    });

    if (!response.errors) {
      onUserAccessChange(response.data?.addNewUserAccess);
    }

    setDialog(false);
  };

  const submitChangeUserAccess = async (user_id: string, role: string) => {
    setIdUserChange(user_id);
    const response = await changeUserAccess({
      variables: {
        input: {
          id: roomId,
          user_id: user_id,
          role: role,
        },
      },
    });

    if (!response.errors) {
      onUserAccessChange(response.data?.changeUserAccess);
    }

    setIdUserChange(null);
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
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
        <div>
          <Form {...formHandler}>
            <form
              onSubmit={formHandler.handleSubmit(submitNewUserAccess)}
              className="flex gap-2"
            >
              <FormField
                control={formHandler.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formHandler.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIEW">Can View</SelectItem>
                          <SelectItem value="EDIT">Can Edit</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={loading} type="submit">
                {loading && <Loader className="h-4 animate-spin"></Loader>}
                Invite
              </Button>
            </form>
          </Form>
        </div>
        <hr className="border-gray-200" />
        <div className="flex max-h-[250px] flex-col gap-3 overflow-y-auto ">
          {users.map((item) => {
            const user = item.userId;
            return (
              <div
                className="flex items-center justify-between"
                key={user?._id}
              >
                <div className="flex items-center gap-2">
                  <FileUserOwner
                    name={user.name}
                    photo={user.photo}
                    withTooltip={false}
                  ></FileUserOwner>
                  <div className="flex flex-col">
                    <p className="text-sm">Jung Rama</p>
                    <p className="text-xs text-muted-foreground">
                      {item.userId.email}
                    </p>
                  </div>
                </div>
                <div>
                  {loadingChangeUserAccess && idUserChange === user._id ? (
                    <div className="flex h-10 w-10 items-center">
                      <Loader className="h-4 animate-spin"></Loader>
                    </div>
                  ) : (
                    <Select
                      value={item.role}
                      disabled={
                        !isCurrentUserFileOwner || item.role === 'OWNER'
                      }
                      onValueChange={(roleValue) => {
                        submitChangeUserAccess(user._id, roleValue);
                      }}
                    >
                      <SelectTrigger className="!shadow-0 border-0 p-0 focus:ring-0">
                        <SelectValue
                          placeholder=""
                          className=" focus:border-0 focus:outline-none"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {item.role === 'OWNER' && (
                          <SelectItem value="OWNER">Owner</SelectItem>
                        )}
                        <SelectItem value="VIEW">Can View</SelectItem>
                        <SelectItem value="EDIT">Can Edit</SelectItem>
                        {item.role !== 'OWNER' && (
                          <SelectItem value="REMOVE">Remove</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <hr className="border-gray-200" />
        <div className="flex w-[90px] cursor-pointer text-xs font-medium text-blue-700">
          <Link className="h-4"></Link> Copy Link
        </div>
      </DialogContent>
    </Dialog>
  );
}
