import { join } from 'path';
import { MieOpts } from '@mie-js/core';
import { Render as Vue2Render } from '@mie-js/vue2-render';

export const config: MieOpts = {
  pages: [
    {
      pageDir: join(__dirname, 'vue2'),
      route: 'vue2',
      Render: Vue2Render,
      dist: join(__dirname, 'dist'),
      template: join(__dirname, 'vue2/static/index.html'),
    }
  ],
  dist: '',
  dev: true,
}
