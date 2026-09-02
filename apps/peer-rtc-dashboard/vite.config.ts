import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

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

const isMediaPipeVisionBundle = (id: string) => {
  const filePath = id.replace('\0', '').split('?')[0] ?? id;
  return (
    filePath.endsWith(`${path.sep}vision_bundle.mjs`) &&
    filePath.includes(`${path.sep}@mediapipe${path.sep}tasks-vision${path.sep}`)
  );
};

const fixMediaPipeSourcemap = () => ({
  name: 'fix-mediapipe-sourcemap',
  enforce: 'pre' as const,
  // Vite+ / Rolldown skips unfiltered load hooks; without this the default fs
  // loader still reads MediaPipe's broken sourceMappingURL and throws ENOENT.
  load: {
    filter: { id: /[\\/]@mediapipe[\\/]tasks-vision[\\/]vision_bundle\.mjs(?:\?|$)/ },
    handler(id: string) {
      if (!isMediaPipeVisionBundle(id)) {
        return;
      }

      const filePath = id.replace('\0', '').split('?')[0] ?? id;
      return fs
        .readFileSync(filePath, 'utf8')
        .replace('sourceMappingURL=vision_bundle_mjs.js.map', 'sourceMappingURL=vision_bundle.mjs.map');
    },
  },
});

const sdpCjsDefaultExport = () => ({
  name: 'sdp-cjs-default-export',
  enforce: 'pre' as const,
  // webrtc-adapter ESM imports `sdp`, whose "module" entry is CJS.
  transform: {
    filter: { id: /[\\/]sdp[\\/]sdp\.js(?:\?|$)/ },
    handler(code: string) {
      if (code.includes('export default')) {
        return;
      }
      return `${code}\nexport default SDPUtils;\n`;
    },
  },
});

const config = defineConfig({
  server: { https },
  optimizeDeps: {
    // Prebundling these hits Rolldown "is a directory" on peerjs-js-binarypack.
    exclude: ['peerjs', 'peerjs-js-binarypack', '@mediapipe/tasks-vision'],
    include: ['sdp', 'webrtc-adapter'],
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
    sdpCjsDefaultExport(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ]),
});

export default config;
