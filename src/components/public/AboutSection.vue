<script setup>
import { ref } from 'vue'

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}
</script>

<template>
  <section id="about" class="py-24 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

      <!-- Texte -->
      <div class="order-2 md:order-1">
        <h3 class="text-brand-yellow uppercase tracking-widest mb-4">
          Ma Vision
        </h3>

        <h2 class="text-4xl font-display mb-6">
          Créativité Intelligente
        </h2>

        <p class="text-gray-300 mb-6 text-lg leading-relaxed">
          Bonjour, je suis <strong>Naomie GBEHOUENOU</strong>. Mon approche du design n'est pas
          seulement esthétique ; elle est stratégique. Chaque courbe, chaque couleur
          (comme ce violet qui m'est cher) a une raison d'être.
        </p>

        <!-- Items de compétences -->
        <div class="space-y-4 mb-8">
          <!-- Item 1 -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-lg bg-brand-purple-main flex items-center justify-center text-brand-yellow flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span class="text-xl">Conception Stratégique</span>
          </div>

          <!-- Item 2 -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-lg bg-brand-purple-main flex items-center justify-center text-brand-purple-vibrant flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <span class="text-xl">Identité Visuelle</span>
          </div>
        </div>

        <button class="px-8 py-3 bg-white text-brand-purple-dark font-bold rounded hover:bg-brand-yellow transition-colors">
          Télécharger mon CV
        </button>
      </div>

      <!-- Photo interactive flip -->
      <div class="order-1 md:order-2 flex justify-center">
        <div class="relative w-80 h-[450px]">

          <!-- Fond décoratif jaune -->
          <div class="absolute inset-0 bg-brand-yellow rounded-[40px] rotate-6"></div>

          <!-- Conteneur flip -->
          <div
            class="photo-container absolute inset-0"
            :class="{ 'is-flipped': isFlipped }"
            @click="toggleFlip"
          >
            <div class="photo-inner w-full h-full">

              <!-- Face avant -->
              <div class="photo-front border-4 border-brand-purple-vibrant">
                <img src="/src/nao.jpeg"
                     alt="Portrait Naomie 1"
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-linear-to-t from-brand-purple-dark to-transparent opacity-40"></div>
                <div class="absolute bottom-6 left-6 right-6 text-center">
                  <p class="text-xs font-bold tracking-[0.4em] uppercase text-brand-yellow">Cliquez pour me voir</p>
                </div>
              </div>

              <!-- Face arrière -->
              <div class="photo-back border-4 border-brand-yellow">
                <img src="/src/na.jpeg"
                     alt="Portrait Naomie 2"
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-linear-to-t from-brand-purple-vibrant/40 to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6 text-center">
                  <p class="text-xs font-bold tracking-[0.4em] uppercase text-white">Créatrice d'univers</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Badge animé -->
          <div class="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-purple-vibrant rounded-full flex items-center justify-center border-4 border-brand-purple-dark animate-bounce z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.photo-container {
  perspective: 1000px;
  cursor: pointer;
}

.photo-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.photo-container.is-flipped .photo-inner {
  transform: rotateY(180deg);
}

.photo-front,
.photo-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 40px;
  overflow: hidden;
}

.photo-back {
  transform: rotateY(180deg);
}
</style>