import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, lazyPlugins } from 'vite-plus';

import { fmt } from './fmt.config';
import { env } from './src/env';

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

const config = defineConfig(({ command }) => {
  process.env.NODE_EXTRA_CA_CERTS ??= mkcertRootCa();

  const certFile = path.resolve(root, env.SSL_CERT_FILE);
  const keyFile = path.resolve(root, env.SSL_KEY_FILE);

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
      jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
      rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
      options: { typeAware: true, typeCheck: true },
    },
    resolve: { tsconfigPaths: true },
    plugins: lazyPlugins(() => [
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
    ]),
    server: { https },
  };
});

export default config;
