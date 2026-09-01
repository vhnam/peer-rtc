import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@peer-rtc/ui/components/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@peer-rtc/ui/components/pagination';

import type { ConsultRequestsSearch } from './consult-requests.types';

const visiblePageItems = (current: number, totalPages: number): Array<number | 'ellipsis'> => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [...new Set([1, totalPages, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const items: Array<number | 'ellipsis'> = [];

  for (const page of pages) {
    const previous = items[items.length - 1];
    if (typeof previous === 'number' && page - previous > 1) {
      items.push('ellipsis');
    }
    items.push(page);
  }

  return items;
};

export const ConsultRequestsPagination = ({ page, limit, total }: { page: number; limit: number; total: number }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) {
    return null;
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {from}-{to} of {total}
      </p>
      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            {page <= 1 ? (
              <Button variant="ghost" size="default" disabled className="pl-1.5">
                <ChevronLeftIcon data-icon="inline-start" />
                <span className="hidden sm:block">Previous</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="default"
                className="pl-1.5"
                nativeButton={false}
                render={
                  <Link to="/" search={(previous: ConsultRequestsSearch) => ({ ...previous, page: previousPage })} />
                }
              >
                <ChevronLeftIcon data-icon="inline-start" />
                <span className="hidden sm:block">Previous</span>
              </Button>
            )}
          </PaginationItem>
          {visiblePageItems(page, totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  variant={item === page ? 'outline' : 'ghost'}
                  size="icon"
                  nativeButton={false}
                  aria-current={item === page ? 'page' : undefined}
                  render={<Link to="/" search={(previous: ConsultRequestsSearch) => ({ ...previous, page: item })} />}
                >
                  {item}
                </Button>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            {page >= totalPages ? (
              <Button variant="ghost" size="default" disabled className="pr-1.5">
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="default"
                className="pr-1.5"
                nativeButton={false}
                render={<Link to="/" search={(previous: ConsultRequestsSearch) => ({ ...previous, page: nextPage })} />}
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
