// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import tailwindcss from '@tailwindcss/vite';

const isBuildCommand = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: isBuildCommand ? netlify({ devFeatures: false }) : undefined,
  vite: {
    plugins: [tailwindcss()]
  }
});
