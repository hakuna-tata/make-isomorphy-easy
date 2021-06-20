import Vue from 'vue';

export const createApp = (context): { app: Vue } => {
  const app = new Vue({
    ...context
  });

  return { app };
}
