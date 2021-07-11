import { createApp } from './app';

export default (context): void => {
  const { app } = createApp(context);

  const mountPoint = document.querySelector('[data-server-rendered="true"]') || document.querySelector('#app');
  app.$mount(mountPoint);
}
