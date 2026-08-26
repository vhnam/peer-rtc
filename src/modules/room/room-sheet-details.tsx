import { CopyIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '#/components/ui/sheet';
import { toast } from '#/components/ui/toast';
import { env } from '#/env';

interface RoomSheetDetailsProps {
  roomId: string;
  openInfoDrawer: boolean;
  setOpenInfoDrawer: (open: boolean) => void;
}

const RoomSheetDetails = ({ roomId, openInfoDrawer, setOpenInfoDrawer }: RoomSheetDetailsProps) => {
  const ROOM_JOINING_INFO_URL = `${env.VITE_PUBLIC_APP_URL}/${roomId}`;

  const handleCopyJoiningInfo = () => {
    void navigator.clipboard.writeText(ROOM_JOINING_INFO_URL);

    toast.add({
      title: 'Joining info copied to clipboard',
      type: 'success',
    });
  };

  return (
    <Sheet open={openInfoDrawer} onOpenChange={setOpenInfoDrawer}>
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
