<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  data() {
    return {
      message: 'Welcome to GDrive Navigator'
    }
  }
})
</script>

<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<style lang="scss" scoped>
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    scroll-behavior: smooth;
}
</style>

