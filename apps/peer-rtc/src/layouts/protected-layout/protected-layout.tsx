import { Link, useRouter } from '@tanstack/react-router';
import { ChevronsUpDownIcon, LogOutIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@peer-rtc/ui/components/avatar';
import { Button } from '@peer-rtc/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@peer-rtc/ui/components/dropdown-menu';
import { Skeleton } from '@peer-rtc/ui/components/skeleton';

import { authClient } from '#/lib/auth-client';

const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'PR';
};

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name || 'Account';
  const displayEmail = user?.email || '';

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-none outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <img
              src="/favicon.png"
              alt="Peer RTC"
              width={32}
              height={32}
              decoding="async"
              className="size-8 rounded-sm object-contain object-left dark:invert dark:hue-rotate-180"
            />
            <div className="leading-tight">
              <span className="block text-sm font-medium">Peer RTC</span>
            </div>
          </Link>

          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2 px-1.5 aria-expanded:bg-muted">
                    <Avatar size="sm">
                      {user.image ? <AvatarImage src={user.image} alt={displayName} /> : null}
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-36 truncate sm:inline">{displayName}</span>
                    <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{displayEmail}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          void router.navigate({ to: '/auth/login' });
                        },
                      },
                    });
                  }}
                >
                  <LogOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
