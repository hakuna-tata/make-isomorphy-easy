import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './mieTypes';
import { getPageConfig, matchPage } from './page';
import { initRenderer, render } from './renderer';

export const mie = (opts: MieOpts) : Middleware => {
  const { collections = [], dev = false, dist = '', onError = null } = opts;

  if (!Array.isArray(collections) || !collections.length) {
    throw new Error('collections must be no empty array');
  }

  const pageConfigList = getPageConfig(opts);
  pageConfigList.forEach(pageConfig => {
    initRenderer({
      pageConfig,
      dev,
      dist
    });
  })

  return async (ctx: BaseContext, next: () => Promise<never>) : Promise<void> => {
    const isMethodMatched = ctx.method === 'HEAD' || ctx.method === 'GET';
    const targetPage = matchPage(pageConfigList, ctx.path);

    if (isMethodMatched && targetPage) {
      try {
        ctx.body = await render(ctx, targetPage );
      } catch(e) {
        ctx.status = 500;
        ctx.body = 'internal error';
        
        if (typeof onError === 'function') {
          await onError(e, ctx);
        }
      }
    }

    await next();
  }
}
