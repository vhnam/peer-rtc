import type { OxfmtConfig } from 'vite-plus/fmt';

export const fmt: OxfmtConfig = {
  ignorePatterns: ['src/routeTree.gen.ts'],
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      options: {
        singleQuote: true,
      },
    },
  ],
  sortImports: {
    customGroups: [
      {
        groupName: 'node',
        elementNamePattern: ['node:*', 'node:*/**'],
      },
    ],
    groups: [
      'node',
      'type-import',
      'value-builtin',
      'value-external',
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  sortTailwindcss: {
    stylesheet: './src/styles/global.css',
    functions: ['clsx', 'cn', 'cva'],
    preserveWhitespace: true,
  },
};
