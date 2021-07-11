<template>
  <div class="demo" @click="clickPage">{{ demo }}</div>
</template>

<script>
export default {
  data() {
    return { demo: "demo page by xxx" };
  },
  methods: {
    clickPage() {
      this.demo = 'i am clicking';
    }
  }
};
</script>

<style scoped>
  .demo {
    font-size: 16px;
    color: #c09;
  }
</style>
