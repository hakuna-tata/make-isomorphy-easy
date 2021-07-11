import { createApp } from './app';

export default (context): Vue => {
  const { app } = createApp(context);

  return app;
}
