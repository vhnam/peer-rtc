import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { getConsultRequest, listConsultRequests } from './consult-requests.service';
import type { ConsultRequestListParams } from './consult-requests.types';

export const consultRequestQueryKeys = {
  all: ['consult-requests'] as const,
  list: (params: ConsultRequestListParams) => [...consultRequestQueryKeys.all, 'list', params] as const,
  request: (params: { requestId: string }) => [...consultRequestQueryKeys.all, 'request', params.requestId] as const,
};

export const consultRequestsQueryOptions = (params: ConsultRequestListParams) =>
  queryOptions({
    queryKey: consultRequestQueryKeys.list(params),
    queryFn: () => listConsultRequests(params),
    placeholderData: keepPreviousData,
  });

export const consultRequestQueryOptions = (params: { requestId: string }) =>
  queryOptions({
    queryKey: consultRequestQueryKeys.request(params),
    queryFn: () => getConsultRequest(params.requestId),
  });
