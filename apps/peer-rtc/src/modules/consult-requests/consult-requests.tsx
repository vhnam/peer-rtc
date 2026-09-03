import { useSuspenseQuery } from '@tanstack/react-query';
import { ClipboardListIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@peer-rtc/ui/components/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@peer-rtc/ui/components/empty';
import { useIsMobile } from '@peer-rtc/ui/hooks/use-mobile';

import ConsultRequestCreateDialog from './consult-requests-create-dialog';
import { ConsultRequestsFilter } from './consult-requests-filter';
import { ConsultRequestsPagination } from './consult-requests-pagination';
import { ConsultRequestsTable } from './consult-requests-table';
import { consultRequestsQueryOptions } from './consult-requests.queries';
import type { ConsultRequestListParams } from './consult-requests.types';

export const ConsultRequestsPage = ({ page, limit, consumerId, status, time, requestId }: ConsultRequestListParams) => {
  const isMobile = useIsMobile();

  const { data } = useSuspenseQuery(consultRequestsQueryOptions({ page, limit, consumerId, status, time, requestId }));
  const requests = data.data;

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <>
      <div className="mx-auto w-full min-w-0 container px-4">
        <div className="flex min-w-0 flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-lg font-medium">Consult requests</h1>
              <p className="text-xs text-muted-foreground">Your requested consultations.</p>
            </div>
            <Button size={isMobile ? 'icon-sm' : 'sm'} onClick={() => setOpenCreateDialog(true)}>
              <PlusIcon className="size-4" />
              <span className="hidden sm:block">Request consultation</span>
            </Button>
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
      </div>

      <ConsultRequestCreateDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
    </>
  );
};
