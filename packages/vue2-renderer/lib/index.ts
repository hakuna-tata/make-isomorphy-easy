import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance }  from '@mie-js/core';
import { DevPacker } from '@mie-js/vue2-packer';
import { BundleRenderer } from 'vue-server-renderer';

export class Renderer implements RendererInstance {
  static type = '@mie-js/vue2-render';
  static packer = '@mie-js/vue2-packer';

  public options: RendererOpts;

  private innerRenderer: BundleRenderer;
  private devPacker;

  constructor(options: RendererOpts) {
    this.options = options;
    // console.log('vue2 renderer:', this.options);
  }

  async render(context: BaseContext): Promise<string> {
    const innerRenderer = this.getInnerRenderer();
    const requestPath = context.path.replace(/\/$/, '');
    const isPageRequest =
      requestPath === this.options.pageConfig.route || requestPath === this.options.pageConfig.route.replace(/\/index$/, '');

    return new Promise((resolve, reject) => {
      if(!isPageRequest) {
        if (this.devPacker) {
          return this.devPacker.proxy(context);
        }
      }

      innerRenderer.renderToString(context, (error, res) => {
        if (error) {
          return reject(error);
        }
        resolve(res);
      });
    });
  }

  private getInnerRenderer() {
    if (this.innerRenderer) {
      return this.innerRenderer;
    }

    if (this.options.dev) {
      this.devPacker = new DevPacker(this.options.pageConfig);
      this.innerRenderer = this.devPacker.getBuildingRender();

      return this.innerRenderer;
    } else {
      this.innerRenderer = this.createInnerRenderer(this.options.dist);

      return this.innerRenderer;
    }
  }

  private createInnerRenderer(dist: string): BundleRenderer {
    return {} as BundleRenderer;
 }
}
