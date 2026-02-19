<script setup>
import { ref, onMounted } from 'vue'
import { useWorks } from '@/composables/useWorks'
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'

const router = useRouter()
const { works, loading: worksLoading, fetchWorks } = useWorks(false)
const { categories, fetchCategories } = useCategories()

const selectedCategory = ref(null)

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  await fetchWorks(categoryId)
}

const getCoverImage = (work) => {
  if (!work.images || work.images.length === 0) return null
  const cover = work.images.find(img => img.is_cover)
  return cover ? cover.image_url : work.images[0].image_url
}

const goToWork = (work) => {
  router.push({ name: 'work-detail', params: { slug: work.slug } })
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchWorks()])
})
</script>

<template>
  <section id="projets" class="py-24 bg-brand-purple-main/20">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Header -->
      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-brand-yellow text-sm uppercase tracking-[0.3em] mb-2 font-bold">
            Sélection de travaux
          </h2>
          <h3 class="text-4xl md:text-5xl font-display font-bold">
            PORTFOLIO
          </h3>
        </div>
        <div class="hidden md:block">
          <span class="text-gray-400">Projets 2024-2025</span>
        </div>
      </div>

      <!-- Filtres catégories -->
      <div v-if="categories.length > 0" class="flex flex-wrap gap-3 mb-12">
        <button
          @click="selectCategory(null)"
          :class="[
            'px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300',
            selectedCategory === null
              ? 'bg-brand-yellow text-brand-purple-dark'
              : 'border border-brand-purple-main text-gray-400 hover:border-brand-yellow hover:text-brand-yellow'
          ]"
        >
          Tous
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          :class="[
            'px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300',
            selectedCategory === cat.id
              ? 'bg-brand-yellow text-brand-purple-dark'
              : 'border border-brand-purple-main text-gray-400 hover:border-brand-yellow hover:text-brand-yellow'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="worksLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="rounded-2xl bg-brand-purple-main/50 aspect-4/5 animate-pulse"></div>
      </div>

      <!-- Grille projets -->
      <div v-else-if="works.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="work in works"
          :key="work.id"
          class="group relative overflow-hidden rounded-2xl bg-brand-purple-main aspect-4/5 cursor-pointer"
          @click="goToWork(work)"
        >
          <img
            v-if="getCoverImage(work)"
            :src="getCoverImage(work)"
            :alt="work.title"
            class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          >
          <div v-else class="w-full h-full bg-brand-purple-main flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-brand-purple-vibrant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="absolute inset-0 bg-linear-to-t from-brand-purple-dark via-transparent opacity-90"></div>

          <div class="absolute bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span class="text-brand-yellow text-xs font-bold uppercase tracking-widest">
              {{ work.category?.name || 'Projet' }}
            </span>
            <h4 class="text-2xl font-display font-bold mt-2">{{ work.title }}</h4>
          </div>

          <div v-if="work.featured" class="absolute top-4 right-4 px-3 py-1 bg-brand-yellow text-brand-purple-dark text-xs font-bold uppercase rounded-full">
            ★ Featured
          </div>
        </div>
      </div>

      <!-- Aucun projet -->
      <div v-else class="text-center py-20 text-gray-500">
        <p class="text-xl">Aucun projet dans cette catégorie</p>
      </div>

    </div>
  </section>
</template>