import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { listConsultRequests } from './consult-requests.service';
import type { ConsultRequestListParams } from './consult-requests.types';

export const consultRequestQueryKeys = {
  all: ['consult-requests'] as const,
  list: (params: ConsultRequestListParams) => [...consultRequestQueryKeys.all, 'list', params] as const,
};

export const consultRequestsQueryOptions = (params: ConsultRequestListParams) =>
  queryOptions({
    queryKey: consultRequestQueryKeys.list(params),
    queryFn: () => listConsultRequests(params),
    placeholderData: keepPreviousData,
  });
