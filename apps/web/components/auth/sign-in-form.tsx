import { GET_ME_QUERY, SIGN_IN_MUTATION } from '@/query/auth.gql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button } from '@ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { AlertCircleIcon, Github, Loader2Icon } from 'lucide-react';

import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/cookie-service.utils';
import { Alert, AlertDescription } from '@ui/components/ui/alert';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/index.store';
import { setUser } from '@/store/user.store';
import { useToast } from '@ui/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const [mutateLogin, { loading, error }] = useMutation(SIGN_IN_MUTATION, {
    variables: {
      input: {
        email: 'email@mail.com',
        password: 'password',
      },
    },
  });

  const [getMe, { loading: loadingGetMe, error: errorGetMe }] =
    useLazyQuery(GET_ME_QUERY);

  const signInCredentialAction = async () => {
    const { data: loginData } = await mutateLogin();

    if (!error && loginData?.loginUser?.access_token) {
      setAccessToken(loginData.loginUser.access_token);
      setRefreshToken(loginData.loginUser.refresh_token);

      const { data: dataMe } = await getMe();

      if (!dataMe) {
        toast({
          title: 'Error',
          description: 'Something went wrong! we could not sign you in',
          variant: 'destructive',
        });

        return;
      }

      dispatch(setUser(dataMe.getMe.user));

      router.push('/files');
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome Back 🎉</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {JSON.stringify(userData)}
        {error && (
          <Alert variant={'destructive'}>
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="mt-[2px] h-4 w-4"></AlertCircleIcon>
              <AlertDescription>{error.message}</AlertDescription>
            </div>
          </Alert>
        )}
        <Button variant="outline" className="flex gap-1">
          <Github className="h-4 w-4"></Github>
          Github
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="johndoe@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={signInCredentialAction}
          className="w-full"
          disabled={loading || loadingGetMe}
        >
          {(loading || loadingGetMe) && (
            <Loader2Icon className="h-5 animate-spin"></Loader2Icon>
          )}
          {!(loading || loadingGetMe) && <span>Sign In</span>}
        </Button>
      </CardFooter>
    </Card>
  );
}
