import { ChevronDownIcon, MicIcon, MicOffIcon, PhoneIcon, VideoIcon, VideoOffIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { ButtonGroup } from '#/components/ui/button-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip';

interface RoomFooterProps {
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  leaveRoom: () => void;
}

export const RoomFooter = ({
  isMicrophoneEnabled,
  isCameraEnabled,
  toggleMicrophone,
  toggleCamera,
  leaveRoom,
}: RoomFooterProps) => {
  return (
    <footer className="flex h-20 shrink-0 items-center justify-center">
      <div className="flex items-center justify-center gap-4 bg-muted px-4 py-2">
        <ButtonGroup aria-label="Microphone controls" className="h-fit">
          <Button variant="outline" size="icon-lg">
            <ChevronDownIcon />
          </Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={isMicrophoneEnabled ? 'outline' : 'destructive'}
                  onClick={toggleMicrophone}
                  size="icon-lg"
                  aria-pressed={isMicrophoneEnabled}
                >
                  {isMicrophoneEnabled ? <MicIcon /> : <MicOffIcon />}
                </Button>
              }
            />
            <TooltipContent>
              <p>Toggle microphone</p>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup aria-label="Camera controls" className="h-fit">
          <Button variant="outline" size="icon-lg">
            <ChevronDownIcon />
          </Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={isCameraEnabled ? 'outline' : 'destructive'}
                  size="icon-lg"
                  onClick={toggleCamera}
                  aria-pressed={isCameraEnabled}
                >
                  {isCameraEnabled ? <VideoIcon /> : <VideoOffIcon />}
                </Button>
              }
            />
            <TooltipContent>
              <p>Toggle camera</p>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="destructive" size="icon-lg" onClick={leaveRoom}>
                <PhoneIcon className="rotate-135" />
              </Button>
            }
          />
          <TooltipContent>
            <p>Leave room</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
};
