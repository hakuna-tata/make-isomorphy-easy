import { BaseContext } from 'koa';

export default async (ctx: BaseContext, next: () => Promise<never>) :Promise<void> => {
  try {
    await next();
  } catch(error) {
    ctx.status = 500;
  }
}
