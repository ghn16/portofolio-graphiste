<script setup>
</script>

<template>
  <section id="accueil" class="min-h-screen flex items-center relative overflow-hidden px-6 pt-20">

    <!-- Blobs d'ambiance -->
    <div class="blob top-0 left-0"></div>
    <div class="blob bottom-0 right-0" style="animation-delay: -5s;"></div>

    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">

      <!-- Texte -->
      <div class="animate__animated animate__fadeInLeft">
        <h2 class="text-brand-yellow font-display uppercase tracking-widest mb-4">
          Graphiste & Brand Designer
        </h2>

        <h1 class="text-6xl md:text-8xl font-display font-extrabold leading-none mb-6">
          NAOMIE <br>
          <span class="text-gradient">GBEHOUENOU</span>
        </h1>

        <p class="text-xl text-gray-300 max-w-lg mb-10 leading-relaxed">
          Ambitieuse. Créative. Intelligente.
          Je transforme vos idées en identités visuelles percutantes et mémorables.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="#projets"
             class="px-8 py-4 bg-brand-yellow text-brand-purple-dark font-bold rounded-lg hover:scale-105 transition-transform">
            Voir mes projets
          </a>
          <a href="#contact"
             class="px-8 py-4 border border-brand-purple-vibrant text-white font-bold rounded-lg hover:bg-brand-purple-vibrant/20 transition-all">
            Me contacter
          </a>
        </div>
      </div>

      <!-- Image -->
      <div class="relative animate__animated animate__fadeInRight">
        <div class="relative w-full aspect-square flex items-center justify-center">
          <div class="absolute inset-0 bg-brand-purple-main rounded-3xl rotate-6 opacity-30 animate-pulse"></div>
          <div class="absolute inset-0 border-2 border-brand-yellow rounded-3xl -rotate-3 transition-transform hover:rotate-0 duration-700"></div>

          <div class="z-10 bg-white w-4/5 h-4/5 rounded-2xl flex items-center justify-center p-8 glass-card border-none overflow-hidden">
            <img src="/public/logo-nao.jpeg"
                 alt="Logo Complet Nao Graphics"
                 class="w-full h-full object-contain hover:scale-105 transition-transform duration-500">
          </div>
        </div>
      </div>

    </div>
  </section>
</template>