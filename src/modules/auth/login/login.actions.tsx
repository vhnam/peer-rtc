import { useRouter } from '@tanstack/react-router';

import type { LoginSchemaType } from '#/schemas/login.schema';

import { useLoginMutation } from '#/queries/auth';

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
