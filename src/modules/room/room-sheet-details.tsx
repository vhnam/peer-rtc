import { Sheet, SheetContent, SheetHeader, SheetTitle } from "#/components/ui/sheet";
import { toast } from "#/components/ui/toast";
import { CopyIcon } from "lucide-react";
import { Button } from "#/components/ui/button";

interface RoomSheetDetailsProps {
  roomId: string;
  openInfoDrawer: boolean;
  setOpenInfoDrawer: (open: boolean) => void;
}

const RoomSheetDetails = ({ roomId, openInfoDrawer, setOpenInfoDrawer }: RoomSheetDetailsProps) => {
  const handleCopyJoiningInfo = () => {
    void navigator.clipboard.writeText(`https://localhost:3000/${roomId}`);

    toast.add({
      title: "Joining info copied to clipboard",
      type: "success",
    });
  };

  return (
    <Sheet open={openInfoDrawer} onOpenChange={setOpenInfoDrawer}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Room Details</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <div className="py-8 space-y-2">
            <div className="text-sm font-medium">Joining info</div>
            <p className="text-xs font-mono text-muted-foreground">{`https://localhost:3000/${roomId}`}</p>
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
