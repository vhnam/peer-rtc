import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

const nonEmptyString = v.pipe(v.string(), v.minLength(1));

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_PUBLIC_APP_URL: v.pipe(nonEmptyString, v.url()),
  },
  runtimeEnv: {
    VITE_PUBLIC_APP_URL: import.meta.env.VITE_PUBLIC_APP_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === '1',
});
