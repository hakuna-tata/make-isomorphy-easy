import Vue from 'vue';

export const createApp =  (context): { app: Vue } => {
  const App = context.app

  const app = new Vue({
    name: 'App',
    render: h => h(App),
  })

  return { app };
}
