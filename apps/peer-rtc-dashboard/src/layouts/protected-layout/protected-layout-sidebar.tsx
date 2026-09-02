import { Link, useMatchRoute, useRouter } from '@tanstack/react-router';
import { BookOpen, ChevronsUpDownIcon, ClipboardList, LogOutIcon, SettingsIcon, type LucideIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@peer-rtc/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@peer-rtc/ui/components/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@peer-rtc/ui/components/sidebar';

import { authClient } from '#/lib/auth-client';
import { getAvatarInitials } from '#/utils/avatar';

type NavUrl = '/' | '/consult-requests';

const NAV_ITEMS: Array<{ title: string; url: NavUrl; icon: LucideIcon }> = [
  { title: 'Home', url: '/', icon: BookOpen },
  { title: 'Consult requests', url: '/consult-requests', icon: ClipboardList },
];

export function ProtectedLayoutSidebar() {
  const { isMobile } = useSidebar();
  const matchRoute = useMatchRoute();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name || 'Staff';
  const displayEmail = user?.email || '';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <img
                src="/favicon.png"
                alt="Peer RTC - Dashboard"
                width={32}
                height={32}
                decoding="async"
                className="size-8 rounded-sm object-contain object-left dark:invert dark:hue-rotate-180"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Peer RTC</span>
                <span className="truncate text-xs text-muted-foreground">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const isActive = Boolean(
                matchRoute({
                  to: item.url,
                  fuzzy: item.url !== '/',
                }),
              );

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton isActive={isActive} tooltip={item.title} render={<Link to={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                render={<DropdownMenuTrigger />}
              >
                <Avatar>
                  {user?.image ? <AvatarImage src={user.image} alt={displayName} /> : null}
                  <AvatarFallback>{getAvatarInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>
                </div>
                <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
              </SidebarMenuButton>
              <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <Link to="/settings">
                      <SettingsIcon className="size-4" />
                      <span>Settings</span>
                    </Link>
                  }
                />
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
                  <LogOutIcon className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
