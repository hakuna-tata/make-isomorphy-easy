import { BaseContext } from 'koa';
import { RenderOpts, RenderInstance }  from '@mie-js/core';

export class Render implements RenderInstance {
  static type = '@mie-js/vue2-render';
  static packer = '@mie-js/vue2-packer';

  public options: RenderOpts;

  constructor(options: RenderOpts) {
    this.options = options;
  }

  async render(context: BaseContext): Promise<string> {
    return new Promise((resolve, reject) => {});
  }
}
