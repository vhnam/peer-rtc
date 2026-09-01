import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { authUserAdditionalFields } from './additional-fields.ts';

const createAuthClientWithBaseURL = (baseURL: string) =>
  createAuthClient({
    baseURL,
    plugins: [
      inferAdditionalFields({
        user: authUserAdditionalFields,
      }),
    ],
  });

export type PeerAuthClient = ReturnType<typeof createAuthClientWithBaseURL>;

let peerAuthClient: PeerAuthClient | undefined;

export const createPeerAuthClient = (baseURL: string) => {
  peerAuthClient = createAuthClientWithBaseURL(baseURL);
  return peerAuthClient;
};

export const getAuthClient = () => {
  if (!peerAuthClient) {
    throw new Error('Auth client is not created. Call createPeerAuthClient with VITE_PUBLIC_AUTH_URL first.');
  }

  return peerAuthClient;
};
