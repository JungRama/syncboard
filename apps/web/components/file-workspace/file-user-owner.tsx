import { initialName, userProfile } from '@/utils/user-profile.utils';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';

export default function FileUserOwner({
  name,
  photo,
  withTooltip = true,
}: {
  name: string;
  photo?: string | null;
  withTooltip?: boolean;
}) {
  return (
    <>
      {withTooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="rounded-full border-[2px] last:mr-[0px] hover:z-10 hover:border-[#000]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userProfile(photo, initialName(name))}
                  ></AvatarImage>
                  <AvatarFallback className="text-[10px]">
                    {initialName(name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent className="z-50">
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {!withTooltip && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={userProfile(photo, initialName(name))}
          ></AvatarImage>
          <AvatarFallback className="text-[10px]">
            {initialName(name)}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
}
