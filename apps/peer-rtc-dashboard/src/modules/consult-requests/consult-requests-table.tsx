import { Link } from '@tanstack/react-router';
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
  type Column,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { PhoneIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

import { Badge } from '@peer-rtc/ui/components/badge';
import { buttonVariants } from '@peer-rtc/ui/components/button';
import { Card, CardContent } from '@peer-rtc/ui/components/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@peer-rtc/ui/components/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@peer-rtc/ui/components/tooltip';
import { cn } from '@peer-rtc/ui/lib/utils';

import type { ConsultRequest, ConsultRequestStatus } from './consult-requests.types';

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  columnMeta: {} as { className?: string; headerClassName?: string },
});

const columnHelper = createColumnHelper<typeof features, ConsultRequest>();

const getCommonPinningStyles = (column: Column<typeof features, ConsultRequest>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastStartPinnedColumn = isPinned === 'start' && column.getIsLastColumn('start');
  const isFirstEndPinnedColumn = isPinned === 'end' && column.getIsFirstColumn('end');

  return {
    boxShadow: isLastStartPinnedColumn
      ? 'inset -4px 0 4px -4px color-mix(in oklab, var(--foreground) 25%, transparent)'
      : isFirstEndPinnedColumn
        ? 'inset 4px 0 4px -4px color-mix(in oklab, var(--foreground) 25%, transparent)'
        : undefined,
    insetInlineStart: isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd: isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return '—';
  }

  const date = dayjs(value);

  return date.format('MMM D, YYYY h:mm A');
};

const formatStatusLabel = (status: ConsultRequestStatus) => {
  return status
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const statusBadgeVariant = (status: ConsultRequestStatus) => {
  switch (status) {
    case 'accepted':
      return 'default' as const;
    case 'closed':
      return 'secondary' as const;
    case 'canceled':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
};

const ConsultRequestStatusBadge = ({ status }: { status: ConsultRequestStatus }) => {
  return <Badge variant={statusBadgeVariant(status)}>{formatStatusLabel(status)}</Badge>;
};

const columns = columnHelper.columns([
  columnHelper.accessor('requestId', {
    id: 'requestId',
    header: 'Request ID',
    size: 180,
    meta: {
      className: 'bg-card font-mono',
      headerClassName: 'bg-card',
    },
  }),
  columnHelper.accessor((row) => row.consumer.name, {
    id: 'consumer',
    header: 'Consumer',
    size: 180,
    meta: {
      className: 'truncate',
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 120,
    cell: (info) => <ConsultRequestStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('note', {
    header: 'Note',
    size: 220,
    cell: (info) => info.getValue() ?? '—',
    meta: {
      className: 'truncate',
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    size: 180,
    cell: (info) => formatTimestamp(info.getValue()),
  }),
  columnHelper.accessor('acceptedAt', {
    header: 'Accepted',
    size: 180,
    cell: (info) => formatTimestamp(info.getValue()),
  }),
  columnHelper.accessor('closedAt', {
    header: 'Closed',
    size: 180,
    cell: (info) => formatTimestamp(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    size: 80,
    meta: {
      className: 'text-right',
    },
    cell: (info) => {
      if (['closed', 'canceled'].includes(info.row.original.status)) {
        return null;
      }

      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/consult-requests/$roomId"
                params={{ roomId: info.row.original.id }}
                className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
              >
                <PhoneIcon className="size-3" />
              </Link>
            }
          />
          <TooltipContent>
            <p>Take call</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  }),
]);

export const ConsultRequestsTable = ({ requests }: { requests: ConsultRequest[] }) => {
  const table = useTable({
    features,
    columns,
    data: requests,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        start: ['requestId'],
        end: [],
      },
    },
  });

  const rows = table.getRowModel().rows;

  const tableWidth = table.getTotalSize();

  return (
    <Card className="min-w-0 max-w-full overflow-hidden">
      <CardContent className="min-w-0">
        <div className="relative w-full min-w-0 overflow-x-auto">
          <table
            className="caption-bottom w-full text-xs"
            style={{
              width: '100%',
              minWidth: tableWidth,
              borderCollapse: 'collapse',
              borderSpacing: 0,
              tableLayout: 'fixed',
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(header.column.columnDef.meta?.headerClassName)}
                      style={getCommonPinningStyles(header.column)}
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className, 'group-hover:bg-muted')}
                      style={getCommonPinningStyles(cell.column)}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
