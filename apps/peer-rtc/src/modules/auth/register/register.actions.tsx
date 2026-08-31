import { useRouter } from '@tanstack/react-router';

import { useRegisterMutation } from '#/queries/auth';
import type { RegisterSchemaType } from '#/schemas/register.schema';

export const useRegisterFormActions = () => {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const submitRegister = async (payload: RegisterSchemaType) => {
    await registerMutation.mutateAsync({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    await router.navigate({ to: '/' });
  };

  return {
    isRegisterPending: registerMutation.isPending,
    registerMutation,
    submitRegister,
  };
};
