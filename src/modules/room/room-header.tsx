import { InfoIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';

import { RoomClock } from './room-clock';

interface RoomHeaderProps {
  roomId: string;
  setOpenInfoSheet: (open: boolean) => void;
}

const RoomHeader = ({ roomId, setOpenInfoSheet }: RoomHeaderProps) => {
  return (
    <div className="flex h-12 shrink-0 items-center gap-4 px-4 py-4 lg:px-6">
      <RoomClock />
      <Separator orientation="vertical" />
      <span>{roomId}</span>
      <Button
        className="text-primary hover:text-primary/80"
        size="icon"
        variant="ghost"
        onClick={() => setOpenInfoSheet(true)}
      >
        <InfoIcon />
      </Button>
    </div>
  );
};

export default RoomHeader;
