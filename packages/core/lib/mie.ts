import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './mieTypes';
import { getPageConfig, matchPage } from './page';
import { initRender } from './renderer';

export const mie = (opts: MieOpts) : Middleware => {
  const { pages = [], dev = false, dist = '' } = opts;
  if (Array.isArray(pages) && pages.length) {
    const pageRouteList = getPageConfig(opts);

    if (!dev) {
      // TODO
    }

    return async (ctx: BaseContext, next: () => Promise<never>) : Promise<void> => {
      const isMethodMatched = ctx.method === 'HEAD' || ctx.method === 'GET';
      const targetPage = matchPage(pageRouteList, ctx.path);

      if (isMethodMatched && targetPage) {
        try {
          ctx.body = await initRender(ctx, { dev, dist, pageConfig: targetPage });
        } catch(e) {
          ctx.status = 500;
          ctx.body = 'internal error';
        }
      }

      await next();
    }
  } else {
    throw new Error('pages must be no empty array');
  }
}
