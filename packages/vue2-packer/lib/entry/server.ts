import { BaseContext } from 'koa';
import { createApp } from './app';

export default async (context: BaseContext): Promise<Vue> => {
  const { app } = await createApp(context);

  return app;
}
