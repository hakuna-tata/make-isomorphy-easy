import { BaseContext } from 'koa';
import { RenderOpts, RenderInstance } from './renderTypes';

const renderCache: {
  [key: string]: RenderInstance
} = {};

const initRender = (opts: RenderOpts) => {
  const { pageConfig } = opts;

  try {
    const renderInstance = new pageConfig.Render(opts);

    renderCache[pageConfig.route] = renderInstance;
  } catch (error) {
    throw new Error(`[page: ${pageConfig.route}] init render error`);
  }
}

export const render = async (ctx: BaseContext, opts: RenderOpts): Promise<string> => {
  const { pageConfig } = opts;
  if (renderCache[pageConfig.route] === undefined) {
    initRender(opts);
  }
  return await renderCache[pageConfig.route].render(ctx);
}
