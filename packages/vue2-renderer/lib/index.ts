import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance }  from '@mie-js/core';
import { BundleRenderer } from 'vue-server-renderer';

export class Renderer implements RendererInstance {
  static type = '@mie-js/vue2-render';
  static packer = '@mie-js/vue2-packer';

  public options: RendererOpts;

  private innerRenderer: BundleRenderer;

  constructor(options: RendererOpts) {
    this.options = options;

    // console.log('vue2 renderer:', this.options);

    if (!this.options.dev) {
      this.createInnerRenderer(this.options.dist);
    }
  }

  async render(context: BaseContext): Promise<string> {
    const innerRenderer = this.getInnerRenderer();

    return new Promise((resolve, reject) => {});
  }

  private createInnerRenderer(dist: string) {

  }


  private getInnerRenderer() {
    if (this.innerRenderer) {
      return this.innerRenderer;
    }

    if (this.options.dev) {
      // todo
    } else {
      // todo
    }

    return this.innerRenderer;
  }
}
