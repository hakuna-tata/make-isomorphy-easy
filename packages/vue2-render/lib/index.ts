import { BaseContext } from 'koa';
import { RenderOpts, RenderInstance }  from '@mie-js/core';

export class Render implements RenderInstance {
  public options: RenderOpts;

  constructor(options: RenderOpts) {
    this.options = options;
  }

  async render(context: BaseContext): Promise<string> {
    return new Promise((resolve, reject) => {});
  }
}
