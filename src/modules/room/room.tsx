import { InfoIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';

import { RoomClock } from './room-clock';
import RoomFooter from './room-footer';
import RoomSheetDetails from './room-sheet-details';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex h-12 shrink-0 items-center gap-4 px-4 py-4 lg:px-6">
        <RoomClock />
        <Separator orientation="vertical" />
        <span>{roomId}</span>
        <Button
          className="text-primary hover:text-primary/80"
          size="icon"
          variant="ghost"
          onClick={() => setOpenInfoDrawer(true)}
        >
          <InfoIcon />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 lg:px-6">
        <div className="aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] bg-primary" />
      </div>

      <RoomFooter />

      <RoomSheetDetails roomId={roomId} openInfoDrawer={openInfoDrawer} setOpenInfoDrawer={setOpenInfoDrawer} />
    </div>
  );
};

export default Room;
