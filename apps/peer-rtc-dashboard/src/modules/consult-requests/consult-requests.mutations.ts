import { useMutation, useQueryClient } from '@tanstack/react-query';

import { consultRequestQueryKeys } from './consult-requests.queries';
import { updateConsultRequest } from './consult-requests.service';
import type { ConsultRequest, UpdateConsultRequestPayload } from './consult-requests.types';

export const useUpdateConsultRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ConsultRequest, Error, UpdateConsultRequestPayload>({
    mutationFn: updateConsultRequest,
    retry: false,
    onSuccess: (consultRequest) => {
      queryClient.setQueryData(consultRequestQueryKeys.request({ requestId: consultRequest.id }), consultRequest);
      void queryClient.invalidateQueries({ queryKey: consultRequestQueryKeys.all });
    },
  });
};
