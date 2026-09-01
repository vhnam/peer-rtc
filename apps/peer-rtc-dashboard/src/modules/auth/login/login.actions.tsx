import { useRouter } from '@tanstack/react-router';

import { useLoginMutation, type LoginSchemaType } from '@peer-rtc/auth';

export const useLoginFormActions = () => {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const submitLogin = async (payload: LoginSchemaType) => {
    await loginMutation.mutateAsync(payload);
    await router.navigate({ to: '/' });
  };

  return {
    isLoginPending: loginMutation.isPending,
    loginMutation,
    submitLogin,
  };
};
