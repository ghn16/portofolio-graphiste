<template>
  <div class="min-h-screen bg-brand-purple-dark text-white">

    <!-- Navbar simple -->
    <nav class="fixed w-full z-50 bg-brand-purple-dark/90 backdrop-blur-md border-b border-brand-purple-main/50">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-9 h-9 bg-white rounded flex items-center justify-center p-1 overflow-hidden">
            <img src="/logo-nao.jpeg" alt="Logo" class="object-contain w-full h-full">
          </div>
          <span class="font-display text-base md:text-xl tracking-tighter uppercase font-bold">
            Nao<span class="text-brand-yellow">.</span>
          </span>
        </router-link>
        <button @click="$router.back()"
          class="flex items-center gap-2 px-4 py-2 border border-brand-purple-main/60 rounded-full
                 text-sm font-bold uppercase tracking-wider hover:border-brand-yellow hover:text-brand-yellow transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span class="hidden sm:inline">Retour</span>
        </button>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center gap-6 pt-20">
      <div class="w-14 h-14 rounded-full border-4 border-brand-purple-main border-t-brand-yellow animate-spin"></div>
      <p class="text-gray-400 uppercase tracking-widest text-sm">Chargement...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error || !currentWork" class="min-h-screen flex flex-col items-center justify-center gap-6 px-4 pt-20">
      <div class="w-24 h-24 rounded-full bg-brand-purple-main/50 flex items-center justify-center">
        <svg class="h-12 w-12 text-brand-purple-vibrant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
        </svg>
      </div>
      <h1 class="text-2xl font-display font-bold">Projet non trouvé</h1>
      <p class="text-gray-400 text-center">Ce projet n'existe pas ou n'est plus disponible.</p>
      <router-link to="/"
        class="px-8 py-3 bg-brand-yellow text-brand-purple-dark font-bold rounded-lg hover:scale-105 transition-transform">
        ← Retour au portfolio
      </router-link>
    </div>

    <!-- Contenu -->
    <div v-else class="pt-20">

      <!-- Hero du projet -->
      <div class="relative overflow-hidden">
        <!-- Image cover en pleine largeur -->
        <div v-if="coverImage" class="relative h-[40vh] md:h-[60vh] w-full">
          <img :src="coverImage.image_url" :alt="currentWork.title"
               class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-linear-to-t from-brand-purple-dark via-brand-purple-dark/40 to-transparent"></div>
        </div>
        <!-- Fond dégradé si pas d'image cover -->
        <div v-else class="h-32 md:h-48 bg-linear-to-b from-brand-purple-main/30 to-brand-purple-dark"></div>

        <!-- Infos projet superposées -->
        <div class="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6 md:pb-10">
          <div class="max-w-7xl mx-auto">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-3">
              <router-link to="/#projets" class="hover:text-brand-yellow transition-colors">Portfolio</router-link>
              <span>/</span>
              <span v-if="currentWork.category"
                    class="px-3 py-1 bg-brand-purple-vibrant/80 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {{ currentWork.category.name }}
              </span>
            </div>
            <h1 class="font-display font-extrabold leading-tight text-white"
                style="font-size: clamp(1.8rem, 5vw, 3.5rem);">
              {{ currentWork.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 mt-3 text-gray-400 text-xs md:text-sm">
              <span class="flex items-center gap-1.5">
                <svg class="h-4 w-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <polyline points="12 6 12 12 16 14" stroke-width="2"/>
                </svg>
                {{ formatDate(currentWork.created_at) }}
              </span>
              <span v-if="currentWork.images?.length" class="flex items-center gap-1.5">
                <svg class="h-4 w-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
                  <polyline points="21 15 16 10 5 21" stroke-width="2"/>
                </svg>
                {{ currentWork.images.length }} image{{ currentWork.images.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Corps de la page -->
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

        <!-- Galerie -->
        <section v-if="currentWork.images?.length" class="mb-12 md:mb-16">

          <!-- Image principale -->
          <div class="relative rounded-2xl overflow-hidden bg-brand-purple-main/30 mb-4 cursor-zoom-in group"
               @click="openLightbox(selectedImageIndex)">
            <img
              :src="selectedImage.image_url"
              :alt="selectedImage.alt_text || currentWork.title"
              class="w-full max-h-[70vh] object-contain mx-auto block"
            >
            <!-- Bouton fullscreen -->
            <button class="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-brand-purple-dark/80 backdrop-blur-sm
                           border border-brand-purple-main flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-all duration-300
                           hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-purple-dark text-white">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          </div>

          <!-- Thumbnails -->
          <div v-if="currentWork.images.length > 1"
               class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(image, index) in currentWork.images"
              :key="image.id"
              @click="selectImage(index)"
              :class="[
                'flex-shrink-0 w-20 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden transition-all duration-300 border-2',
                selectedImageIndex === index
                  ? 'border-brand-yellow scale-105 shadow-lg shadow-brand-yellow/20'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-brand-purple-main'
              ]"
            >
              <img :src="image.image_url" :alt="image.alt_text || `Image ${index + 1}`"
                   class="w-full h-full object-cover">
            </button>
          </div>
        </section>

        <!-- Description -->
        <section v-if="currentWork.description"
                 class="glass-card p-6 md:p-10 rounded-2xl mb-12">
          <h2 class="text-xl md:text-2xl font-display font-bold mb-5 flex items-center gap-3">
            <span class="w-1 h-6 bg-brand-yellow rounded-full"></span>
            À propos du projet
          </h2>
          <p class="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
            {{ currentWork.description }}
          </p>
        </section>

        <!-- CTA bas de page -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-brand-purple-main/30">
          <button @click="$router.back()"
            class="flex items-center gap-2 px-6 py-3 border border-brand-purple-main/60 rounded-full
                   font-bold uppercase tracking-wider text-sm hover:border-brand-yellow hover:text-brand-yellow
                   transition-all duration-300 w-full sm:w-auto justify-center">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour au portfolio
          </button>
          <a :href="`https://wa.me/22900000000?text=${encodeURIComponent('Bonjour Naomie, j\'ai vu votre projet ' + currentWork.title + ' et je souhaite discuter d\'un projet similaire.')}`"
             target="_blank"
             class="flex items-center gap-3 px-6 py-3 bg-brand-purple-vibrant rounded-full
                    font-bold uppercase tracking-wider text-sm hover:bg-brand-yellow hover:text-brand-purple-dark
                    transition-all duration-300 w-full sm:w-auto justify-center shadow-lg shadow-brand-purple-vibrant/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Commander un projet similaire
          </a>
        </div>

      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxOpen"
           class="fixed inset-0 z-[9999] bg-brand-purple-dark/95 backdrop-blur-md flex items-center justify-center p-4"
           @click.self="closeLightbox">

        <!-- Fermer -->
        <button @click="closeLightbox"
          class="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full
                 bg-brand-purple-main/50 border border-brand-purple-main flex items-center justify-center
                 hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-purple-dark text-white
                 transition-all duration-300 hover:rotate-90">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Précédent -->
        <button v-if="currentWork.images.length > 1"
          @click="previousImage" :disabled="lightboxIndex === 0"
          :class="[
            'absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full',
            'border flex items-center justify-center transition-all duration-300',
            lightboxIndex === 0
              ? 'border-brand-purple-main/30 text-gray-600 opacity-30 cursor-not-allowed'
              : 'border-brand-purple-main bg-brand-purple-main/50 hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-purple-dark text-white'
          ]">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <polyline points="15 18 9 12 15 6" stroke-width="2"/>
          </svg>
        </button>

        <!-- Image -->
        <img
          :src="currentWork.images[lightboxIndex]?.image_url"
          :alt="currentWork.images[lightboxIndex]?.alt_text"
          class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
        >

        <!-- Suivant -->
        <button v-if="currentWork.images.length > 1"
          @click="nextImage" :disabled="lightboxIndex === currentWork.images.length - 1"
          :class="[
            'absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full',
            'border flex items-center justify-center transition-all duration-300',
            lightboxIndex === currentWork.images.length - 1
              ? 'border-brand-purple-main/30 text-gray-600 opacity-30 cursor-not-allowed'
              : 'border-brand-purple-main bg-brand-purple-main/50 hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-purple-dark text-white'
          ]">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <polyline points="9 18 15 12 9 6" stroke-width="2"/>
          </svg>
        </button>

        <!-- Compteur -->
        <div class="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2
                    px-5 py-2 rounded-full bg-brand-purple-main/60 backdrop-blur-sm
                    border border-brand-purple-main text-sm font-bold">
          <span class="text-brand-yellow">{{ lightboxIndex + 1 }}</span>
          <span class="text-gray-400 mx-1">/</span>
          <span class="text-gray-300">{{ currentWork.images.length }}</span>
        </div>

      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorks } from '@/composables/useWorks'

const route = useRoute()
const { currentWork, loading, error, fetchWorkBySlug } = useWorks()

const selectedImageIndex = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const coverImage = computed(() => {
  if (!currentWork.value?.images?.length) return null
  return currentWork.value.images.find(i => i.is_cover) || currentWork.value.images[0]
})

const selectedImage = computed(() => {
  return currentWork.value?.images?.[selectedImageIndex.value] || { image_url: '', alt_text: '' }
})

const selectImage = (index) => { selectedImageIndex.value = index }

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const previousImage = () => { if (lightboxIndex.value > 0) lightboxIndex.value-- }
const nextImage = () => { if (lightboxIndex.value < currentWork.value.images.length - 1) lightboxIndex.value++ }

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleKeyboard = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') previousImage()
  if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => {
  fetchWorkBySlug(route.params.slug)
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>