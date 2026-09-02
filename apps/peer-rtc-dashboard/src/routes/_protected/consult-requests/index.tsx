import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { InfoIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@peer-rtc/ui/components/alert';
import { Skeleton } from '@peer-rtc/ui/components/skeleton';

import {
  ConsultRequestsPage,
  consultRequestsQueryOptions,
  parseConsultRequestsSearch,
} from '#/modules/consult-requests';

export const Route = createFileRoute('/_protected/consult-requests/')({
  validateSearch: parseConsultRequestsSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient, user }, deps }) =>
    queryClient.query({
      ...consultRequestsQueryOptions({ ...deps, providerId: user.id }),
      staleTime: 'static',
    }),
  component: ConsultRequestsRoute,
  pendingComponent: ConsultRequestsPending,
  errorComponent: ConsultRequestsError,
});

function ConsultRequestsRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();

  return <ConsultRequestsPage {...search} providerId={user.id} />;
}

function ConsultRequestsPending() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ConsultRequestsError({ error }: { error: Error }) {
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
        <AlertTitle>Unable to load consult requests</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}
