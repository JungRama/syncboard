import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <>
      <header className="z-50 flex w-full flex-wrap text-sm md:flex-nowrap md:justify-start">
        <nav
          className="relative mx-2 mt-6 w-full max-w-[85rem] rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Link
              className="flex-none text-xl font-semibold dark:text-white"
              href="/"
              aria-label="Brand"
            >
              <Image
                src={'/logo.svg'}
                width={160}
                height={160}
                alt="logo"
              ></Image>
            </Link>
            <div className="md:hidden">
              <button
                type="button"
                className="hs-collapse-toggle flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                data-hs-collapse="#navbar-collapse-with-animation"
                aria-controls="navbar-collapse-with-animation"
                aria-label="Toggle navigation"
              >
                <svg
                  className="hs-collapse-open:hidden h-4 w-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden h-4 w-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div
            id="navbar-collapse-with-animation"
            className="hs-collapse hidden grow basis-full overflow-hidden transition-all duration-300 md:block"
          >
            <div className="mt-5 flex flex-col gap-x-0 gap-y-4 md:mt-0 md:flex-row md:items-center md:justify-end md:gap-x-7 md:gap-y-0 md:ps-7">
              <Link
                className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-orange-600  md:my-6 md:border-s md:border-gray-300 md:ps-6"
                href="/auth"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Log in
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="block text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl md:text-5xl">
              Collaborate with other in one simple{' '}
              <span className="text-orange-600">board</span>
            </h1>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl">
            <div className="h-96 w-full rounded-xl bg-[url('https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1981&q=80')] bg-cover bg-center bg-no-repeat object-cover sm:h-[480px]"></div>

            <div className="absolute inset-0 h-full w-full">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <a
                  className="inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  href="#"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Play the overview
                </a>
              </div>
            </div>

            <div className="absolute -start-20 bottom-12 -z-[1] h-48 w-48 rounded-lg bg-gradient-to-b from-orange-500 to-white p-px dark:to-slate-900">
              <div className="h-48 w-48 rounded-lg bg-white dark:bg-slate-900"></div>
            </div>

            <div className="absolute -end-20 -top-12 -z-[1] h-48 w-48 rounded-full bg-gradient-to-t from-blue-600 to-cyan-400 p-px">
              <div className="h-48 w-48 rounded-full bg-white dark:bg-slate-900"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
