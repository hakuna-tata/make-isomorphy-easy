import { createApp } from './app';

export default (context) => {
  const { app } = createApp(context);

  const mountPoint = document.querySelector('[data-server-rendered="true"]') || document.getElementById('app');
  app.$mount(mountPoint);
}
