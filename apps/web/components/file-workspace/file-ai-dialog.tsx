import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import {
  AlertCircleIcon,
  Brain,
  BrainCircuit,
  HelpCircleIcon,
  Link,
  ShareIcon,
  Star,
} from 'lucide-react';

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
import { Label } from '@ui/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@ui/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';
import { Textarea } from '@ui/components/ui/textarea';

export default function FileAIDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 ">
          ✨<p>Use AI</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Create with AI</DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertCircleIcon className="pr-1"></AlertCircleIcon>
          <AlertTitle>We don't save your API Key</AlertTitle>
          <AlertDescription>
            Your api key saved on the client cookies. Using this feature is at
            your own risk.
          </AlertDescription>
        </Alert>

        <div className="flex items-end gap-2">
          <div className="w-full">
            <Input placeholder="Enter OpenAI API key"></Input>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon></HelpCircleIcon>
                </TooltipTrigger>
                <TooltipContent>
                  <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key">
                    How to get OpenAI API Key
                  </a>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Textarea placeholder="Enter your prompt. example: Create a diagram that explains how HTTP/2 works."></Textarea>

        <Button>Generate</Button>
      </DialogContent>
    </Dialog>
  );
}
