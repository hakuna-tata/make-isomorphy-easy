import { BaseContext } from 'koa';
import Vue from 'vue';

export const createApp = async(context: BaseContext): Promise<{ app: Vue }> => {
  const app = await import ('E:/Project/my-project/make-isomorphy-easy/example/vue2/demo/App.vue').then(App => {
    const app = new Vue({
      render: h => h(App.default),
      ...context
    });

    return app;
  })

  return { app };
}
