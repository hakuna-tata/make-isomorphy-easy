import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './mieTypes';
import { getPageConfig, matchPage } from './page';
import { render } from './render';

export const mie = (opts: MieOpts) : Middleware => {
  const { pages = [], dev = false } = opts;
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
          ctx.body = await render(ctx, { dev, pageConfig: targetPage });
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
