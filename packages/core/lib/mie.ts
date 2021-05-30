import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './optTypes';

export const mie = (opts: MieOpts) : Middleware => {
  const { pages = [] } = opts;
  if (Array.isArray(pages) && pages.length !== 0) {
    return async (ctx: BaseContext, next: () => Promise<never>) : Promise<void> => {
      await next();
    }
  } else {
    throw new Error('pages must be no empty array')
  }
}
