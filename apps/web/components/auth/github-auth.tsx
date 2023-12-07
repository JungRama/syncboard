'use client';

import { Button } from '@ui/components/ui/button';
import { Github } from 'lucide-react';

export default function GithubAuth() {
  return (
    <Button variant="outline" className="flex w-full gap-1" asChild>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}
      >
        <Github className="h-4 w-4"></Github>
        Github
      </a>
    </Button>
  );
}
