import { BaseContext } from 'koa';
import { RenderOpts, RenderInstance } from './renderTypes';

const renderCache: {
  [key: string]: RenderInstance
} = {};

export const initRender = async (ctx: BaseContext, opts: RenderOpts): Promise<string> => {
  const { pageConfig } = opts;
  if (renderCache[pageConfig.route] === undefined) {
    try {
      const renderInstance = new pageConfig.Render(opts);

      renderCache[pageConfig.route] = renderInstance;
    } catch (error) {
      throw new Error(`[page: ${pageConfig.route}] init render error`);
    }
  }

  return await renderCache[pageConfig.route].render(ctx);
}
