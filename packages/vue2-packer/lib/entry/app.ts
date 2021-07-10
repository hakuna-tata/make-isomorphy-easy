import Vue from 'vue';

export const createApp = (context): { app: Vue } => {
  const app = new Vue({
    template: '<div>12356</div>'
  });

  return { app };
}
