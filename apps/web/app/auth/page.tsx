'use client';

import SignInForm from '@/components/auth/sign-in-form';
import SignUpForm from '@/components/auth/sign-up-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ui/components/ui/tabs';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className='bg-[url("/white-gradient.webp")]'>
      <div className="container">
        <div className="flex h-[100vh] items-center justify-center gap-[15px] lg:gap-[30px]">
          <div className="col-span-12 flex flex-col items-center gap-4 md:col-span-6 lg:col-span-4">
            <Image
              src={'/logo.svg'}
              width={200}
              height={200}
              alt="logo"
            ></Image>

            <Tabs defaultValue="sign-in" className="w-[400px]">
              <TabsList className="flex w-full">
                <TabsTrigger value="sign-in" className="w-full">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="sign-up" className="w-full">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in">
                <SignInForm></SignInForm>
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUpForm></SignUpForm>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
