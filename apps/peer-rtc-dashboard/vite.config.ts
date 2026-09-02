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

const mediapipeWasmSrc = path.resolve(root, 'node_modules/@mediapipe/tasks-vision/wasm');
const mediapipePublicDir = path.resolve(root, 'public/mediapipe');
const mediapipeWasmDest = path.resolve(mediapipePublicDir, 'wasm');
const selfieSegmenterDest = path.resolve(mediapipePublicDir, 'selfie_segmenter_landscape.tflite');
const selfieSegmenterUrl =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite';

const ensureSelfieSegmenterModel = async () => {
  if (fs.existsSync(selfieSegmenterDest) && fs.statSync(selfieSegmenterDest).size > 0) {
    return;
  }

  fs.mkdirSync(mediapipePublicDir, { recursive: true });
  const response = await fetch(selfieSegmenterUrl);
  if (!response.ok) {
    throw new Error(`Failed to download selfie segmenter model (${response.status})`);
  }

  fs.writeFileSync(selfieSegmenterDest, Buffer.from(await response.arrayBuffer()));
};

const copyMediaPipeAssets = () => ({
  name: 'copy-mediapipe-assets',
  async buildStart() {
    fs.cpSync(mediapipeWasmSrc, mediapipeWasmDest, { recursive: true });
    await ensureSelfieSegmenterModel();
  },
});

const fixMediaPipeSourcemap = () => ({
  name: 'fix-mediapipe-sourcemap',
  enforce: 'pre' as const,
  load(id: string) {
    if (!id.endsWith(`${path.sep}vision_bundle.mjs`) || !id.includes(`${path.sep}@mediapipe${path.sep}tasks-vision${path.sep}`)) {
      return;
    }

    return fs
      .readFileSync(id, 'utf8')
      .replace('sourceMappingURL=vision_bundle_mjs.js.map', 'sourceMappingURL=vision_bundle.mjs.map');
  },
});

const config = defineConfig({
  server: { https },
  optimizeDeps: {
    // Prebundling these hits Rolldown "is a directory" on peerjs-js-binarypack.
    exclude: ['peerjs', 'peerjs-js-binarypack', '@mediapipe/tasks-vision'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    // WebRTC / WASM clients — do not bundle into the Nitro/SSR graph.
    external: ['peerjs', 'peerjs-js-binarypack', '@mediapipe/tasks-vision'],
  },
  plugins: lazyPlugins(() => [
    copyMediaPipeAssets(),
    fixMediaPipeSourcemap(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ]),
});

export default config;
