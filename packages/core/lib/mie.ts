import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './mieTypes';
import { scanPages } from './page';

export const mie = (opts: MieOpts) : Middleware => {
  const { pages = [], dev = false } = opts;
  if (Array.isArray(pages) && pages.length !== 0) {
    const targetPages = scanPages(opts);

    if (!dev) {
      // TODO
    }

    return async (ctx: BaseContext, next: () => Promise<never>) : Promise<void> => {
      await next();
    }
  } else {
    throw new Error('pages must be no empty array');
  }
}
