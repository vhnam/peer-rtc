import type { BetterAuthOptions } from 'better-auth';

export const authUserAdditionalFields = {
  role: {
    type: ['consumer', 'provider'] as const,
    required: false,
    input: true,
    returned: true,
  },
} satisfies NonNullable<NonNullable<BetterAuthOptions['user']>['additionalFields']>;
