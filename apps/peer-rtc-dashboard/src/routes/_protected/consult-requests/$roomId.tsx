import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { InfoIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@peer-rtc/ui/components/alert';
import { Skeleton } from '@peer-rtc/ui/components/skeleton';

import { CallRoomPage } from '#/modules/call-room';
import { consultRequestQueryOptions } from '#/modules/consult-requests';

export const Route = createFileRoute('/_protected/consult-requests/$roomId')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.query({
      ...consultRequestQueryOptions({ requestId: params.roomId }),
      staleTime: 'static',
    }),
  component: CallRoomRoute,
  pendingComponent: CallRoomPending,
  errorComponent: CallRoomError,
});

function CallRoomRoute() {
  const consultRequest = Route.useLoaderData();

  return <CallRoomPage consultRequest={consultRequest} />;
}

function CallRoomPending() {
  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

function CallRoomError({ error }: { error: Error }) {
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="py-4">
      <Alert variant="destructive">
        <InfoIcon />
        <AlertTitle>Unable to load consult request</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}
