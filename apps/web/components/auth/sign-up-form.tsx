import { useLayoutEffect, useState } from 'react';

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
import { AlertCircleIcon, CheckCircle2, Loader2Icon } from 'lucide-react';

import useAuthService from '@/services/auth.service';
import { getAccessToken } from '@/utils/cookie-service.utils';
import { signUpValidationSchema } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import GithubAuth from './github-auth';

export default function SignInForm() {
  const token = getAccessToken();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (token) {
      redirect('/files');
    }
  }, []);

  const { mutateRegister, loadingRegister, errorRegister } = useAuthService();

  const formHandler = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const signInCredentialAction = async (data) => {
    await mutateRegister({
      variables: {
        input: {
          name: data.name,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        },
      },
    });

    if (!errorRegister) {
      setSuccessMessage(
        'Account created successfully! Login with your credentials.',
      );
    }
  };

  return (
    <Form {...formHandler}>
      <form onSubmit={formHandler.handleSubmit(signInCredentialAction)}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account ✨</CardTitle>
            <CardDescription>
              Get started, enter information and credential below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {errorRegister && (
              <Alert variant={'destructive'}>
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="mt-[2px] h-4 w-4"></AlertCircleIcon>
                  <AlertDescription>{errorRegister.message}</AlertDescription>
                </div>
              </Alert>
            )}

            {successMessage && (
              <Alert variant={'default'}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="mt-[2px] h-8 w-8"></CheckCircle2>
                  <AlertDescription>{successMessage}</AlertDescription>
                </div>
              </Alert>
            )}

            <FormField
              control={formHandler.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={formHandler.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
                disabled={loadingRegister}
              >
                {loadingRegister && (
                  <Loader2Icon className="h-5 animate-spin"></Loader2Icon>
                )}
                {!loadingRegister && <span>Sign Up</span>}
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
                <GithubAuth></GithubAuth>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
