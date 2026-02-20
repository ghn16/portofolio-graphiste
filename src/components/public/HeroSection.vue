<script setup>
</script>

<template>
  <section id="accueil" class="min-h-screen flex items-center relative overflow-hidden px-4 md:px-6 pt-20 pb-12">

    <div class="blob top-0 left-0"></div>
    <div class="blob bottom-0 right-0" style="animation-delay: -5s;"></div>

    <div class="max-w-7xl mx-auto w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">

        <!-- Image en haut sur mobile -->
        <div class="order-1 md:order-2 flex justify-center">
          <div class="relative w-48 h-48 sm:w-64 sm:h-64 md:w-full md:h-auto md:aspect-square flex items-center justify-center">
            <div class="absolute inset-0 bg-brand-purple-main rounded-3xl rotate-6 opacity-30 animate-pulse"></div>
            <div class="absolute inset-0 border-2 border-brand-yellow rounded-3xl -rotate-3"></div>
            <div class="z-10 bg-white w-4/5 h-4/5 rounded-2xl flex items-center justify-center p-4 md:p-8 overflow-hidden">
              <img
                src="/logo-nao.jpeg"
                alt="Logo Nao Graphics"
                class="w-full h-full object-contain"
              >
            </div>
          </div>
        </div>

        <!-- Texte en bas sur mobile -->
        <div class="order-2 md:order-1 text-center md:text-left min-w-0">
          <h2 class="text-brand-yellow font-display uppercase tracking-widest mb-2 text-xs sm:text-sm font-bold">
            Graphiste &amp; | Posters, branding & visuels de communication | Motion designer
          </h2>

          <!-- Taille fluide avec clamp pour éviter le débordement -->
          <h1 class="font-display font-extrabold leading-none mb-4 break-words" style="font-size: clamp(2rem, 10vw, 5rem);">
            NAOMIE<br>
            <span class="text-gradient">GBEHOUENOU</span>
          </h1>

          <p class="text-sm sm:text-base md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0 mb-6 leading-relaxed">
            Je transforme vos idées en identités visuelles percutantes et mémorables.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a href="#projets"
               class="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-brand-yellow text-brand-purple-dark font-bold rounded-lg hover:scale-105 transition-transform text-sm md:text-base text-center">
              Voir mes projets
            </a>
            <a href="#contact"
               class="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border border-brand-purple-vibrant text-white font-bold rounded-lg hover:bg-brand-purple-vibrant/20 transition-all text-sm md:text-base text-center">
              Me contacter
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>