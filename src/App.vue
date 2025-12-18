<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Raccourci : Ctrl + Shift + A pour admin
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      router.push('/admin/login')
    }
  })
})
</script>

<style>
/* Import des styles globaux */
@import './assets/styles/variables.css';
@import './assets/styles/main.css';

/* Styles de base pour #app */
#app {
  min-height: 100vh;
}
</style>