import { CopyIcon } from 'lucide-react';

import { Button } from '@peer-rtc/ui/components/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@peer-rtc/ui/components/sheet';
import { toast } from '@peer-rtc/ui/components/toast';

import { env } from '#/env';

interface RoomSheetDetailsProps {
  roomId: string;
  openInfoSheet: boolean;
  setOpenInfoSheet: (open: boolean) => void;
}

const RoomSheetDetails = ({ roomId, openInfoSheet, setOpenInfoSheet }: RoomSheetDetailsProps) => {
  const ROOM_JOINING_INFO_URL = `${env.VITE_PUBLIC_APP_URL}/${roomId}`;

  const handleCopyJoiningInfo = () => {
    void navigator.clipboard.writeText(ROOM_JOINING_INFO_URL);

    toast.add({
      title: 'Joining info copied to clipboard',
      type: 'success',
    });
  };

  return (
    <Sheet open={openInfoSheet} onOpenChange={setOpenInfoSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Room Details</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <div className="space-y-2 py-8">
            <div className="text-sm font-medium">Joining info</div>
            <p className="font-mono text-xs text-muted-foreground">{ROOM_JOINING_INFO_URL}</p>
          </div>
          <Button variant="outline" onClick={handleCopyJoiningInfo}>
            <CopyIcon /> Copy joining info
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoomSheetDetails;
