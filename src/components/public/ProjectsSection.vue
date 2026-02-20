<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWorks } from '@/composables/useWorks'
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'

const router = useRouter()
const { works, loading: worksLoading, fetchWorks } = useWorks(false)
const { categories, fetchCategories } = useCategories()

const selectedCategory = ref(null)
const currentPage = ref(1)
const perPage = 9

const totalPages = computed(() => Math.ceil(works.value.length / perPage))
const paginatedWorks = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return works.value.slice(start, start + perPage)
})

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  await fetchWorks(categoryId)
}

const prevPage = () => {
  if (currentPage.value > 1) { currentPage.value--; scrollToSection() }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) { currentPage.value++; scrollToSection() }
}
const scrollToSection = () => {
  document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const getCoverImage = (work) => {
  if (!work.images?.length) return null
  return work.images.find(i => i.is_cover)?.image_url || work.images[0].image_url
}
const goToWork = (work) => router.push({ name: 'work-detail', params: { slug: work.slug } })

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchWorks()])
})
</script>

<template>
  <section id="projets" class="py-16 md:py-24 bg-brand-purple-main/20">
    <div class="max-w-7xl mx-auto px-4 md:px-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-10 gap-2">
        <div>
          <h2 class="text-brand-yellow text-xs md:text-sm uppercase tracking-[0.3em] mb-1 md:mb-2 font-bold">
            Sélection de travaux
          </h2>
          <h3 class="text-3xl md:text-5xl font-display font-bold">PORTFOLIO</h3>
        </div>
        <span class="text-gray-500 text-sm">Projets 2024-2025</span>
      </div>

      <!-- Pills scroll horizontal -->
      <div v-if="categories.length > 0" class="relative mb-8 md:mb-12">
        <div class="absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-brand-purple-dark to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-brand-purple-dark to-transparent z-10 pointer-events-none"></div>
        <div class="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 px-1">
          <button
            @click="selectCategory(null)"
            :class="[
              'flex-shrink-0 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300',
              selectedCategory === null
                ? 'bg-brand-yellow text-brand-purple-dark shadow-lg shadow-brand-yellow/30'
                : 'border border-brand-purple-main/60 text-gray-400 hover:border-brand-yellow hover:text-brand-yellow'
            ]"
          >Tous</button>
          <button
            v-for="cat in categories" :key="cat.id"
            @click="selectCategory(cat.id)"
            :class="[
              'flex-shrink-0 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300',
              selectedCategory === cat.id
                ? 'bg-brand-yellow text-brand-purple-dark shadow-lg shadow-brand-yellow/30'
                : 'border border-brand-purple-main/60 text-gray-400 hover:border-brand-yellow hover:text-brand-yellow'
            ]"
          >{{ cat.name }}</button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="worksLoading" class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div v-for="n in 6" :key="n" class="rounded-xl bg-brand-purple-main/50 aspect-square animate-pulse"></div>
      </div>

      <!-- Grille 2 cols mobile / 3 cols desktop -->
      <div v-else-if="paginatedWorks.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div
          v-for="work in paginatedWorks" :key="work.id"
          class="group relative overflow-hidden rounded-xl aspect-square cursor-pointer bg-brand-purple-main"
          @click="goToWork(work)"
        >
          <img
            v-if="getCoverImage(work)"
            :src="getCoverImage(work)" :alt="work.title"
            class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          >
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-brand-purple-vibrant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Overlay hover -->
          <div class="absolute inset-0 bg-linear-to-t from-brand-purple-dark via-brand-purple-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex flex-col justify-end p-3 md:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span class="text-brand-yellow text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">
              {{ work.category?.name || 'Projet' }}
            </span>
            <h4 class="text-sm md:text-lg font-display font-bold leading-tight line-clamp-2">{{ work.title }}</h4>
          </div>

          <div v-if="work.featured"
               class="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 bg-brand-yellow text-brand-purple-dark text-xs font-bold rounded-full flex items-center justify-center">
            ★
          </div>
        </div>
      </div>

      <!-- Vide -->
      <div v-else class="text-center py-16">
        <p class="text-gray-500">Aucun projet dans cette catégorie</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 md:gap-6 mt-10 md:mt-14">
        <button
          @click="prevPage" :disabled="currentPage === 1"
          :class="[
            'flex items-center gap-2 px-5 md:px-8 py-2.5 md:py-3 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-300',
            currentPage === 1
              ? 'border border-brand-purple-main/30 text-gray-600 cursor-not-allowed opacity-40'
              : 'border border-brand-purple-vibrant text-white hover:bg-brand-purple-vibrant'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline">Précédent</span>
        </button>

        <!-- Dots -->
        <div class="flex items-center gap-2">
          <span
            v-for="page in totalPages" :key="page"
            :class="[
              'rounded-full transition-all duration-300 cursor-pointer',
              page === currentPage ? 'bg-brand-yellow w-6 h-2' : 'bg-brand-purple-main/60 w-2 h-2 hover:bg-brand-purple-main'
            ]"
            @click="currentPage = page; scrollToSection()"
          ></span>
        </div>

        <button
          @click="nextPage" :disabled="currentPage === totalPages"
          :class="[
            'flex items-center gap-2 px-5 md:px-8 py-2.5 md:py-3 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-300',
            currentPage === totalPages
              ? 'border border-brand-purple-main/30 text-gray-600 cursor-not-allowed opacity-40'
              : 'border border-brand-purple-vibrant text-white hover:bg-brand-purple-vibrant'
          ]"
        >
          <span class="hidden sm:inline">Suivant</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>