<script setup>
import { ref, onMounted } from 'vue'

const mobileOpen = ref(false)

const closeMenu = () => { mobileOpen.value = false }

onMounted(() => {
  const cursor = document.getElementById('cursor-glow')
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    })
  }
})
</script>

<template>
  <div id="cursor-glow" class="cursor-glow hidden md:block"></div>

  <nav class="fixed w-full z-50 bg-brand-purple-dark/90 backdrop-blur-md border-b border-brand-purple-main/50">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">

      <!-- Logo -->
      <a href="#accueil" class="flex items-center space-x-2 logo-container">
        <div class="w-9 h-9 md:w-10 md:h-10 bg-white rounded flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
          <img src="/logo-nao.jpeg" alt="Logo" class="object-contain w-full h-full">
        </div>
        <span class="font-display text-base md:text-xl tracking-tighter uppercase font-bold whitespace-nowrap">
          Nao<span class="text-brand-yellow">.</span>
        </span>
      </a>

      <!-- Desktop menu -->
      <div class="hidden md:flex items-center space-x-8 font-medium uppercase text-sm tracking-widest">
        <a href="#accueil" class="nav-link">Accueil</a>
        <a href="#projets" class="nav-link">Portfolio</a>
        <a href="#about" class="nav-link">À propos</a>
        <a href="#contact"
           class="px-4 py-2 bg-brand-purple-vibrant rounded-full hover:bg-brand-yellow hover:text-brand-purple-dark transition-colors duration-300">
          Travaillons ensemble
        </a>
      </div>

      <!-- Hamburger -->
      <button
        class="md:hidden text-brand-yellow p-2 -mr-2 rounded-lg"
        @click="mobileOpen = !mobileOpen"
        aria-label="Menu"
      >
        <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Menu mobile déroulant -->
    <transition name="slide">
      <div v-if="mobileOpen"
           class="md:hidden bg-brand-purple-dark border-t border-brand-purple-main/30">
        <div class="px-4 py-4 flex flex-col space-y-1">
          <a href="#accueil" @click="closeMenu"
             class="py-3 px-2 uppercase text-sm tracking-widest font-bold border-b border-brand-purple-main/20 hover:text-brand-yellow transition-colors">
            Accueil
          </a>
          <a href="#projets" @click="closeMenu"
             class="py-3 px-2 uppercase text-sm tracking-widest font-bold border-b border-brand-purple-main/20 hover:text-brand-yellow transition-colors">
            Portfolio
          </a>
          <a href="#about" @click="closeMenu"
             class="py-3 px-2 uppercase text-sm tracking-widest font-bold border-b border-brand-purple-main/20 hover:text-brand-yellow transition-colors">
            À propos
          </a>
          <a href="#contact" @click="closeMenu"
             class="mt-3 py-3 px-6 bg-brand-purple-vibrant text-white rounded-full text-center font-bold text-sm uppercase tracking-wider hover:bg-brand-yellow hover:text-brand-purple-dark transition-colors">
            Travaillons ensemble
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.nav-link { position: relative; }
.nav-link:after {
  content: '';
  display: block;
  width: 0; height: 2px;
  background: #F59C1A;
  transition: width .3s;
}
.nav-link:hover:after { width: 100%; }

.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>