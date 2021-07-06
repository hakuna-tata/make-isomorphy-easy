import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance }  from '@mie-js/core';
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

    this.initInnerRenderer();
  }

  async render(context: BaseContext): Promise<string> {
    const requestPath = context.path.replace(/\/$/, '');
    const { pageConfig } = this.options;
    const isPageRequest =
      requestPath === pageConfig.route || requestPath === pageConfig.route.replace(/\/index$/, '');

    return new Promise((resolve, reject) => {
      if(!isPageRequest) {
        if (this.devPacker) {
          return this.devPacker.proxy(context);
        }
      }

      if (this.innerRenderer) {
        this.innerRenderer.renderToString(context, (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        });
      } else {
        reject();
      }
    });
  }

  private async initInnerRenderer() {
    if (this.options.dev) {
      await import(Renderer.packer)
        .then(({ DevPacker }) => {
          this.devPacker = new DevPacker(this.options.pageConfig);
          this.innerRenderer = this.devPacker.getBuildingRenderer();
        })
        .catch((err: Error) => {
          throw err.message;
        })

    } else {
      this.createInnerRenderer(this.options.dist);
    }
  }

  private createInnerRenderer(dist: string): void {

  }
}
