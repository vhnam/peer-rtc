import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  forgotPassword,
  getCurrentSession,
  login,
  register,
  resetPassword,
  type AuthForgotPasswordRequest,
  type AuthLoginRequest,
  type AuthRegisterRequest,
  type AuthResetPasswordRequest,
  type Session,
} from './service.ts';

export const authQueryKeys = {
  all: ['auth'] as const,
  currentSession: () => [...authQueryKeys.all, 'current-session'] as const,
};

export const currentSessionQueryOptions = () =>
  queryOptions({
    queryKey: authQueryKeys.currentSession(),
    queryFn: () => getCurrentSession(),
    retry: false,
  });

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, AuthRegisterRequest>({
    mutationFn: (credentials) => register(credentials),
    retry: false,
    onSuccess: (session) => {
      queryClient.setQueryData(currentSessionQueryOptions().queryKey, session);
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, AuthLoginRequest>({
    mutationFn: (credentials) => login(credentials),
    retry: false,
    onSuccess: (session) => {
      queryClient.setQueryData(currentSessionQueryOptions().queryKey, session);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation<void, Error, AuthForgotPasswordRequest>({
    mutationFn: (payload) => forgotPassword(payload),
    retry: false,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<void, Error, AuthResetPasswordRequest>({
    mutationFn: (payload) => resetPassword(payload),
    retry: false,
  });
};
