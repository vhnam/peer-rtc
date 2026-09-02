import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { lazyPlugins } from 'vite-plus';

const root = path.dirname(fileURLToPath(import.meta.url));
const certPath = path.resolve(root, '.cert/cert.pem');
const keyPath = path.resolve(root, '.cert/key.pem');
const https =
  fs.existsSync(certPath) && fs.existsSync(keyPath)
    ? { cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath) }
    : undefined;

const config = defineConfig({
  server: { https },
  optimizeDeps: {
    // Prebundling these hits Rolldown "is a directory" on peerjs-js-binarypack.
    exclude: ['peerjs', 'peerjs-js-binarypack'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    // WebRTC client — do not bundle into the Nitro/SSR graph.
    external: ['peerjs', 'peerjs-js-binarypack'],
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ]),
});

export default config;
