import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance }  from '@mie-js/core';

export class Renderer implements RendererInstance {
  static type = '@mie-js/vue2-render';
  static packer = '@mie-js/vue2-packer';

  public options: RendererOpts;

  constructor(options: RendererOpts) {
    this.options = options;
  }

  async render(context: BaseContext): Promise<string> {
    return new Promise((resolve, reject) => {});
  }
}
