import { betterAuth } from 'better-auth';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

import { authUserAdditionalFields } from './additional-fields.ts';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: authUserAdditionalFields,
  },
  plugins: [tanstackStartCookies()],
});
