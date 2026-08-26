import { ChevronDownIcon, MicIcon, PhoneOffIcon, VideoIcon } from "lucide-react";
import { ButtonGroup } from "#/components/ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";
import { Button } from "#/components/ui/button";

const RoomFooter = () => {
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
                <Button variant="outline" size="icon-lg">
                  <MicIcon />
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
                <Button variant="outline" size="icon-lg">
                  <VideoIcon />
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
              <Button variant="destructive" size="icon-lg">
                <PhoneOffIcon />
              </Button>
            }
          />
          <TooltipContent>
            <p>Leave the room</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
};

export default RoomFooter;
