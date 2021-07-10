import { join } from 'path';
import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance }  from '@mie-js/core';
import { createBundleRenderer ,BundleRenderer } from 'vue-server-renderer';

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
        .then(async ({ DevPacker }) => {
          this.devPacker = new DevPacker(this.options.dist, this.options.pageConfig);
          this.devPacker.on('buildEnd', () => {
            this.createInnerRenderer(this.options.dist);
          });
          this.innerRenderer = await this.devPacker.getBuildingRenderer();
        })
        .catch((err: Error) => {
          throw err.message;
        })

    } else {
      this.createInnerRenderer(this.options.dist);
    }
  }

  private createInnerRenderer(dist: string): void {
    const { pageConfig } = this.options;
    const serverBundlePath = join(dist, `./server${pageConfig.route}/mie-vue2-server-bundle.json`);
    const clientManifestPath = join(dist, `/client${pageConfig.route}/mie-vue2-client-manifest.json`);

    require.cache[serverBundlePath] = undefined;
    require.cache[clientManifestPath] = undefined;


    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serverBundle = require(serverBundlePath);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const clientManifest = require(clientManifestPath);

      this.innerRenderer = createBundleRenderer(serverBundle, {
        clientManifest,
        runInNewContext: false,
      })
    } catch(error) {
      throw error;
    }
  }
}
