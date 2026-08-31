import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import * as v from 'valibot';
import { defineConfig, lazyPlugins, loadEnv } from 'vite-plus';

import { fmt } from './fmt.config';

const root = path.dirname(fileURLToPath(import.meta.url));

function mkcertRootCa() {
  try {
    const caRoot = execSync('mkcert -CAROOT', { encoding: 'utf8' }).trim();
    const caFile = path.join(caRoot, 'rootCA.pem');
    return fs.existsSync(caFile) ? caFile : undefined;
  } catch {
    return undefined;
  }
}

const tlsEnvSchema = v.object({
  SSL_CERT_FILE: v.pipe(v.string(), v.minLength(1)),
  SSL_KEY_FILE: v.pipe(v.string(), v.minLength(1)),
});

const config = defineConfig(({ command, mode }) => {
  process.env.NODE_EXTRA_CA_CERTS ??= mkcertRootCa();

  for (const [key, value] of Object.entries(loadEnv(mode, root, ''))) {
    process.env[key] ??= value;
  }

  const tlsEnv = v.parse(tlsEnvSchema, {
    SSL_CERT_FILE: process.env.SSL_CERT_FILE,
    SSL_KEY_FILE: process.env.SSL_KEY_FILE,
  });

  const certFile = path.resolve(root, tlsEnv.SSL_CERT_FILE);
  const keyFile = path.resolve(root, tlsEnv.SSL_KEY_FILE);

  const authProxyTarget = (() => {
    const authUrl = process.env.VITE_PUBLIC_AUTH_URL;
    if (!authUrl) {
      return undefined;
    }

    const parsed = new URL(authUrl);
    // Node's HTTP proxy prefers IPv6 for `localhost`, but the auth server
    // often listens on IPv4 only (ECONNREFUSED on ::1).
    if (parsed.hostname === 'localhost') {
      parsed.hostname = '127.0.0.1';
    }
    return parsed.origin;
  })();

  const https =
    command !== 'build' && fs.existsSync(certFile) && fs.existsSync(keyFile)
      ? {
          cert: fs.readFileSync(certFile),
          key: fs.readFileSync(keyFile),
        }
      : undefined;

  if (command !== 'build' && !https) {
    throw new Error(
      `Missing HTTPS cert/key (${certFile}, ${keyFile}).\n` +
        'The basic-ssl plugin is self-signed, so Chrome will keep showing Not Secure.\n' +
        'Use mkcert (trusted local CA):\n' +
        '  mkcert -install\n' +
        '  mkdir -p .cert\n' +
        '  mkcert -cert-file .cert/cert.pem -key-file .cert/key.pem localhost 127.0.0.1 ::1',
    );
  }

  return {
    fmt,
    lint: {
      ignorePatterns: ['src/routeTree.gen.ts'],
      jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
      rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
      options: { typeAware: true, typeCheck: true },
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        'peerjs-js-binarypack': path.resolve(root, 'node_modules/peerjs-js-binarypack'),
      },
    },
    optimizeDeps: {
      include: ['peerjs', 'peerjs-js-binarypack'],
    },
    ssr: {
      optimizeDeps: {
        include: ['peerjs', 'peerjs-js-binarypack'],
      },
    },
    plugins: lazyPlugins(() => [
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
    ]),
    server: {
      https,
      proxy: authProxyTarget
        ? {
            '/api/auth': {
              target: authProxyTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  };
});

export default config;
