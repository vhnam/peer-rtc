import { useSuspenseQuery } from '@tanstack/react-query';
import { ClipboardListIcon } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@peer-rtc/ui/components/empty';

import { ConsultRequestsFilter } from './consult-requests-filter';
import { ConsultRequestsPagination } from './consult-requests-pagination';
import { ConsultRequestsTable } from './consult-requests-table';
import { consultRequestsQueryOptions } from './consult-requests.queries';
import type { ConsultRequestListParams } from './consult-requests.types';

export const ConsultRequestsPage = ({ page, limit, providerId, status, time, requestId }: ConsultRequestListParams) => {
  const { data } = useSuspenseQuery(consultRequestsQueryOptions({ page, limit, providerId, status, time, requestId }));
  const requests = data.data;

  return (
    <div className="flex min-w-0 flex-col gap-6 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-lg font-medium">Consult requests</h1>
        <p className="text-xs text-muted-foreground">Incoming consult requests from consumers.</p>
      </div>
      <ConsultRequestsFilter status={status} time={time} requestId={requestId} />
      {requests.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>No consult requests</EmptyTitle>
            <EmptyDescription>No requests match the selected filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex min-w-0 flex-col gap-4">
          <ConsultRequestsTable requests={requests} />
          <ConsultRequestsPagination page={data.page} limit={data.limit} total={data.total} />
        </div>
      )}
    </div>
  );
};
