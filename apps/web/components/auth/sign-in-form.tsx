import { useLayoutEffect } from 'react';

import { Alert, AlertDescription } from '@ui/components/ui/alert';
import { Button } from '@ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/components/ui/form';
import { Input } from '@ui/components/ui/input';
import { useToast } from '@ui/components/ui/use-toast';
import { AlertCircleIcon, Github, Loader2Icon } from 'lucide-react';

import useAuthService from '@/services/auth.service';
import { setUser } from '@/store/user.store';
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/cookie-service.utils';
import { signInValidationSchema } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

export default function SignInForm() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const token = getAccessToken();

  useLayoutEffect(() => {
    if (token) {
      redirect('/files');
    }
  }, []);

  const {
    mutateLogin,
    loadingLogin,
    errorLogin,

    getMe,
    loadingGetMe,
  } = useAuthService();

  const formHandler = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(signInValidationSchema),
  });

  const signInCredentialAction = async (data) => {
    const { data: loginData } = await mutateLogin({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });

    if (!errorLogin && loginData?.loginUser?.access_token) {
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
    <Form {...formHandler}>
      <form onSubmit={formHandler.handleSubmit(signInCredentialAction)}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back 🎉</CardTitle>
            <CardDescription>
              Enter your credential or use sso to get access to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {errorLogin && (
              <Alert variant={'destructive'}>
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="mt-[2px] h-4 w-4"></AlertCircleIcon>
                  <AlertDescription>{errorLogin.message}</AlertDescription>
                </div>
              </Alert>
            )}
            <FormField
              control={formHandler.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formHandler.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button
                type="submit"
                className="w-full"
                disabled={loadingLogin || loadingGetMe}
              >
                {(loadingLogin || loadingGetMe) && (
                  <Loader2Icon className="h-5 animate-spin"></Loader2Icon>
                )}
                {!(loadingLogin || loadingGetMe) && <span>Sign In</span>}
              </Button>

              <div>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="flex w-full gap-1" asChild>
                  <a href="https://github.com/login/oauth/authorize?client_id=5ed0a8865f5a6cf3e3c6">
                    <Github className="h-4 w-4"></Github>
                    Github
                  </a>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
