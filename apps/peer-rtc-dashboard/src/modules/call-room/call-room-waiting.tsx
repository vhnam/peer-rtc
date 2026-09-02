import { cn } from '@peer-rtc/ui/lib/utils';

import { getAvatarInitials } from '#/utils/avatar';

import type { CallRoomWaitingProps } from './call-room.types';

const RIPPLE_RINGS = [
  { size: '7rem', borderClassName: 'border-primary/80', delayMs: 0 },
  { size: '9.5rem', borderClassName: 'border-primary/50', delayMs: 400 },
  { size: '12rem', borderClassName: 'border-primary/20', delayMs: 800 },
] as const;

export const CallRoomWaiting = ({ consumerName }: CallRoomWaitingProps) => {
  const initials = getAvatarInitials(consumerName);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex size-52 items-center justify-center">
        {RIPPLE_RINGS.map((ring) => (
          <span
            key={ring.size}
            aria-hidden
            className={cn(
              'absolute rounded-full border animate-pulse motion-reduce:animate-none',
              ring.borderClassName,
            )}
            style={{
              width: ring.size,
              height: ring.size,
              animationDelay: `${ring.delayMs}ms`,
            }}
          />
        ))}
        <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-medium text-primary-foreground">
          {initials}
        </div>
      </div>

      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <p className="text-base font-medium text-muted-foreground">Waiting for {consumerName}...</p>
      </div>
    </div>
  );
};
