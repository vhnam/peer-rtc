import { useForgotPasswordMutation, type ForgotPasswordSchemaType } from '@peer-rtc/auth';

import { env } from '#/env';

export const useForgotPasswordFormActions = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const submitForgotPassword = async (payload: ForgotPasswordSchemaType) => {
    await forgotPasswordMutation.mutateAsync({
      email: payload.email,
      redirectTo: `${env.VITE_PUBLIC_APP_URL}/auth/reset-password`,
    });
  };

  return {
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    forgotPasswordMutation,
    submitForgotPassword,
  };
};
