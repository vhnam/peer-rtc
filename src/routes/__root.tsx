import type { PropsWithChildren } from 'react';

import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';

import type { QueryRouterContext } from '#/lib/query';

import { Toaster } from '#/components/ui/toast';
import { TooltipProvider } from '#/components/ui/tooltip';
import appCss from '#/styles/global.css?url';

export const Route = createRootRouteWithContext<QueryRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Peer RTC',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
