import { BaseContext } from 'koa';
import { PageConfig } from './mieTypes';
import { RendererOpts, RendererInstance } from './rendererTypes';

const renderCache: {
  [key: string]: RendererInstance
} = {};

export const initRenderer = (opts: RendererOpts): void => {
  const { pageConfig } = opts;
  try {
      const renderInstance = new pageConfig.Renderer(opts);

      renderCache[pageConfig.route] = renderInstance;
  } catch (error) {
    throw new Error(`[page: ${pageConfig.route}] init render error`);
  }
}

export const render = async (ctx: BaseContext, targetPage: Required<PageConfig>): Promise<string> => {
  return await renderCache[targetPage.route].render(ctx);
}
