import { getAuthClient, type PeerAuthClient } from './client.ts';
import type { AuthRole } from './schemas/login.schema.ts';

export type Session = PeerAuthClient['$Infer']['Session'];

type AuthClientError = {
  message?: string;
  status?: number;
  statusCode?: number;
  code?: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
  role: AuthRole;
};

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthForgotPasswordRequest = {
  email: string;
  redirectTo: string;
};

export type AuthResetPasswordRequest = {
  token: string;
  newPassword: string;
};

const getAuthErrorMessage = (error: AuthClientError | null | undefined, fallbackMessage: string) => {
  return error?.message ?? fallbackMessage;
};

const isUnauthenticatedError = (error: AuthClientError | null | undefined) => {
  return error?.status === 401 || error?.statusCode === 401 || error?.code === 'UNAUTHORIZED';
};

export const register = async (credentials: AuthRegisterRequest): Promise<Session> => {
  const { error } = await getAuthClient().signUp.email({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to register'));
  }

  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Failed to fetch current session');
  }

  return session;
};

export const login = async (credentials: AuthLoginRequest): Promise<Session> => {
  const { error } = await getAuthClient().signIn.email({
    email: credentials.email,
    password: credentials.password,
    role: credentials.role,
  } as Parameters<PeerAuthClient['signIn']['email']>[0]);

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to login'));
  }

  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Failed to fetch current session');
  }

  if (session.user.role && session.user.role !== credentials.role) {
    await getAuthClient().signOut();
    throw new Error('Unauthorized role');
  }

  return session;
};

export const forgotPassword = async ({ email, redirectTo }: AuthForgotPasswordRequest): Promise<void> => {
  const { error } = await getAuthClient().requestPasswordReset({
    email,
    redirectTo,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to send reset email'));
  }
};

export const resetPassword = async ({ token, newPassword }: AuthResetPasswordRequest): Promise<void> => {
  const { error } = await getAuthClient().resetPassword({
    token,
    newPassword,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to reset password'));
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  const { data, error } = await getAuthClient().getSession();

  if (isUnauthenticatedError(error)) {
    return null;
  }

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to fetch current session'));
  }

  return data;
};

export const signOut = async (): Promise<void> => {
  const { error } = await getAuthClient().signOut();

  if (error) {
    throw new Error(getAuthErrorMessage(error, 'Failed to sign out'));
  }
};
