import { Button } from '@peer-rtc/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@peer-rtc/ui/components/dialog';

import { useProviderJoinedPrompt } from '#/lib/socket-client';

export const ProviderJoinedDialog = ({ enabled }: { enabled: boolean }) => {
  const { isOpen, isResponding, accept, decline, isMissedCallOpen, dismissMissedCall } =
    useProviderJoinedPrompt(enabled);

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Provider is ready</DialogTitle>
            <DialogDescription>
              A provider has joined your consult request. Accept to join the call, or decline to stay on this page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isResponding} onClick={decline}>
              Decline
            </Button>
            <Button type="button" disabled={isResponding} onClick={() => void accept()}>
              Accept Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isMissedCallOpen}
        onOpenChange={(open) => {
          if (!open) {
            dismissMissedCall();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Missed call</DialogTitle>
            <DialogDescription>Missed call from provider</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={dismissMissedCall}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
