'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { AlertCircleIcon, HelpCircleIcon, Loader } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@ui/components/ui/alert';
import { Textarea } from '@ui/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';
import OpenAI from 'openai';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index.store';
import { TLGeoShape } from '@tldraw/tldraw';
import { formatShapes } from './useFormatShapes';
import { useEffect, useState } from 'react';
import { getOpenAIKey, setOpenAIKey } from '@/utils/cookie-service.utils';
import { useToast } from '@ui/components/ui/use-toast';

export default function FileAIDialog() {
  const { toast } = useToast();
  const editorTL = useSelector((state: RootState) => state.file.editor);

  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const saveApiKeyToCookie = (value) => {
    setOpenAIKey(value);
  };

  useEffect(() => {
    setApiKey(getOpenAIKey() as string);
  }, [getOpenAIKey()]);

  const buildWithAI = async () => {
    try {
      if (!apiKey || !prompt) {
        toast({
          variant: 'destructive',
          title:
            'Please Enter ' +
            (!apiKey ? 'API Key ' : '') +
            (!prompt ? 'Prompt' : ''),
        });
        return;
      }

      setLoading(true);

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'create a a step-by-step process explaining things.{ shapes: [{type: string, // value can be ellipse, rectangle, diamond // ellipse (start/end) used to represents the start or end of a process in a flowchart // diamond (decision): Represents a decision point, required a yes/no or true/false in arrow and need to have 2 output // rectangle (process): Depicts a process step or action in the flowchart description: string, // describe step 10 - 50 char id: string, // generate random uuid }], arrows: [{ id: string, // generate random uuid start: string, // id of shape to start end: string, // id of shape to end, description: string, // describe about this arrow. this is optional, usually used when connected with diamond shape. }] } you need to provide with those JSON format',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        n: 1,
        response_format: {
          type: 'json_object',
        },
      });

      setDialog(false);
      setLoading(false);

      if (editorTL) {
        editorTL?.createShapes<TLGeoShape>(
          formatShapes(
            editorTL,
            JSON.parse(completion.choices[0].message.content ?? '{}'),
          ),
        );

        editorTL?.zoomToFit();
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: error.message,
      });
    }
  };

  return (
    <Dialog onOpenChange={setDialog} open={dialog}>
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
            <Input
              placeholder="Enter OpenAI API key"
              value={apiKey ?? ''}
              type={apiKey ? 'password' : 'text'}
              autoFocus={false}
              onFocus={(e) => (e.target.type = 'text')}
              onChange={(e) => {
                setApiKey(e.target.value);
              }}
              onBlur={(e) => {
                e.target.type = 'password';
                saveApiKeyToCookie(e.target.value);
              }}
            ></Input>
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

        <Textarea
          autoFocus={true}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt. example: Create a diagram that explains how HTTP/2 works."
        ></Textarea>

        <Button disabled={loading} onClick={buildWithAI}>
          {loading && <Loader className="h-4 animate-spin"></Loader>}
          {loading ? 'Good things take time...' : 'Generate'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
