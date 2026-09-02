import { useRouter } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MicIcon,
  MicOffIcon,
  MonitorIcon,
  MonitorOffIcon,
  PhoneIcon,
  VideoIcon,
  VideoOffIcon,
} from 'lucide-react';

import { Button } from '@peer-rtc/ui/components/button';
import { ButtonGroup } from '@peer-rtc/ui/components/button-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@peer-rtc/ui/components/tooltip';

import type { CallRoomFooterProps } from './call-room.types';

export const CallRoomFooter = ({
  isStartedCall,
  canStartCall,
  isCameraEnabled,
  isMicrophoneEnabled,
  isVirtualBackgroundEnabled,
  onStartCall,
  onEndCall,
  onToggleCamera,
  onToggleMicrophone,
  onToggleVirtualBackground,
}: CallRoomFooterProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.history.back();
  };

  return (
    <footer className="flex items-center -mb-8 py-4 border-t border-border justify-between">
      <Button variant="outline" onClick={handleBack} disabled={isStartedCall}>
        <ArrowLeftIcon /> Back
      </Button>
      <div className="flex gap-2">
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={isMicrophoneEnabled ? 'outline' : 'destructive'}
                  size="icon"
                  onClick={onToggleMicrophone}
                  aria-pressed={isMicrophoneEnabled}
                  aria-label="Toggle microphone"
                >
                  {isMicrophoneEnabled ? <MicIcon /> : <MicOffIcon />}
                </Button>
              }
            />
            <TooltipContent>
              <p>{isMicrophoneEnabled ? 'Turn off microphone' : 'Turn on microphone'}</p>
            </TooltipContent>
          </Tooltip>
          <Button variant="outline" size="icon">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={isCameraEnabled ? 'outline' : 'destructive'}
                  size="icon"
                  onClick={onToggleCamera}
                  aria-pressed={isCameraEnabled}
                  aria-label="Toggle camera"
                >
                  {isCameraEnabled ? <VideoIcon /> : <VideoOffIcon />}
                </Button>
              }
            />
            <TooltipContent>
              <p>{isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="icon">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={isVirtualBackgroundEnabled ? 'outline' : 'destructive'}
                  size="icon"
                  onClick={onToggleVirtualBackground}
                  disabled={!isCameraEnabled}
                  aria-pressed={isVirtualBackgroundEnabled}
                  aria-label="Toggle virtual background"
                >
                  {isVirtualBackgroundEnabled ? <MonitorIcon /> : <MonitorOffIcon />}
                </Button>
              }
            />
            <TooltipContent>
              <p>{isVirtualBackgroundEnabled ? 'Turn off virtual background' : 'Turn on virtual background'}</p>
            </TooltipContent>
          </Tooltip>
          <Button variant="outline" size="icon">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
      </div>
      <div className="pr-(--sidebar-width) mr-4">
        {isStartedCall ? (
          <Button variant="destructive" onClick={onEndCall}>
            <PhoneIcon className="rotate-135" /> End Call
          </Button>
        ) : (
          <Button onClick={onStartCall} disabled={!canStartCall}>
            <PhoneIcon /> Start Call
          </Button>
        )}
      </div>
    </footer>
  );
};
