import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

import { fmt } from './fmt.config';

const config = defineConfig({
  fmt,
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(() => [
    basicSsl(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ]),
});

export default config;
