import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';
import { loadEnv } from 'vite-plus';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

for (const [key, value] of Object.entries(loadEnv(mode, root, ''))) {
  process.env[key] ??= value;
}

const nonEmptyString = v.pipe(v.string(), v.minLength(1));

export const env = createEnv({
  server: {
    SSL_CERT_FILE: nonEmptyString,
    SSL_KEY_FILE: nonEmptyString,
    NODE_EXTRA_CA_CERTS: v.optional(nonEmptyString),
  },
  runtimeEnvStrict: {
    SSL_CERT_FILE: process.env.SSL_CERT_FILE,
    SSL_KEY_FILE: process.env.SSL_KEY_FILE,
    NODE_EXTRA_CA_CERTS: process.env.NODE_EXTRA_CA_CERTS,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === '1' || process.argv.includes('build'),
});
