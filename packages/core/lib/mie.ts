import { BaseContext, Middleware } from 'koa';
import { MieOpts } from './optTypes';

const mie = (opts: MieOpts) : Middleware => {
  // eslint-disable-next-line no-console
  console.log(opts);
  return async (ctx: BaseContext, next: () => Promise<any>) : Promise<void> => {
    await next();
  }
}

export default mie;
