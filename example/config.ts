import { join } from 'path';
import { MieOpts } from '@mie-js/core';
import { Renderer as Vue2Renderer } from '@mie-js/vue2-renderer';

export const config: MieOpts = {
  pages: [
    {
      pageDir: join(__dirname, 'vue2'),
      route: 'vue2',
      Renderer: Vue2Renderer,
      // template: join(__dirname, 'vue2/static/index.html'),
    }
  ],
  dev: true,
  dist: join(__dirname, 'dist'),
}
