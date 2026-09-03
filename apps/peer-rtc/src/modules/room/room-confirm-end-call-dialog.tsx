import { Button } from '@peer-rtc/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@peer-rtc/ui/components/dialog';

interface RoomConfirmEndCallDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export const RoomConfirmEndCallDialog = ({ open, setOpen, onConfirm }: RoomConfirmEndCallDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End call</DialogTitle>
        </DialogHeader>
        <DialogDescription>Are you sure you want to end the call?</DialogDescription>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Continue to call</DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            End Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
