import { BaseContext } from 'koa';
import { RendererOpts, RendererInstance } from './rendererTypes';

const renderCache: {
  [key: string]: RendererInstance
} = {};

export const initRender = async (ctx: BaseContext, opts: RendererOpts): Promise<string> => {
  const { pageConfig } = opts;
  if (renderCache[pageConfig.route] === undefined) {
    try {
      const renderInstance = new pageConfig.Renderer(opts);

      renderCache[pageConfig.route] = renderInstance;
    } catch (error) {
      throw new Error(`[page: ${pageConfig.route}] init render error`);
    }
  }

  return await renderCache[pageConfig.route].render(ctx);
}
