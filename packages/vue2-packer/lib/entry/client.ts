import { BaseContext } from 'koa';
import { createApp } from './app';

export default async (context: BaseContext): Promise<void> => {
  const { app } = await createApp(context);

  const mountPoint = document.querySelector('[data-server-rendered="true"]') || document.querySelector('#app');
  app.$mount(mountPoint);
}
