import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { createConsultRequest, listConsultRequests } from './consult-requests.service';
import type { ConsultRequestListParams, CreateConsultRequestPayload } from './consult-requests.types';

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

export const useCreateConsultRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateConsultRequestPayload>({
    mutationFn: createConsultRequest,
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: consultRequestQueryKeys.all });
    },
  });
};
