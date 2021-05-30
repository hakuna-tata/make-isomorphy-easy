import { join } from 'path';
import { MieOpts } from '@mie-js/core'

export const config: MieOpts = {
  pages: [
    {
      pageDir: join(__dirname, 'vue2'),
      route: 'vue2',
      dist: ''
    }
  ],
  dist: '',
  dev: true,
}
