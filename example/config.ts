import { join } from 'path';
import { MieOpts } from '@mie-js/core';
import { Renderer as Vue2Renderer } from '@mie-js/vue2-renderer';

export const config: MieOpts = {
  collections: [
    {
      pageDir: join(__dirname, 'vue2'),
      Renderer: Vue2Renderer,
      route: 'vue2',
      // template: join(__dirname, 'vue2/assets/index.html'),
    }
  ],
  dev: true,
  dist: join(__dirname, 'dist'),
}
