<template>
  <div class="work-detail-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement de l'œuvre...</p>
    </div>

    <!-- Erreur / Non trouvé -->
    <div v-else-if="error || !currentWork" class="error-container">
      <div class="error-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1>Œuvre non trouvée</h1>
      <p>Cette œuvre n'existe pas ou n'est plus disponible.</p>
      <router-link to="/" class="btn btn-primary btn-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour au portfolio
      </router-link>
    </div>

    <!-- Contenu de l'œuvre -->
    <div v-else class="work-detail">
      <!-- Navigation -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">Portfolio</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ currentWork.title }}</span>
      </nav>

      <!-- Header de l'œuvre -->
      <header class="work-header">
        <div class="work-header-content">
          <span v-if="currentWork.category" class="work-category-badge">
            {{ currentWork.category.name }}
          </span>
          <h1 class="work-title">{{ currentWork.title }}</h1>
          <div class="work-meta">
            <span class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ formatDate(currentWork.created_at) }}
            </span>
            <span v-if="currentWork.images?.length" class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {{ currentWork.images.length }} image{{ currentWork.images.length > 1 ? 's' : '' }}
            </span>
          </div>
        </div>
        <button @click="$router.back()" class="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour
        </button>
      </header>

      <!-- Galerie d'images -->
      <section v-if="currentWork.images?.length" class="gallery-section">
        <!-- Image principale -->
        <div class="main-image-container">
          <img 
            :src="selectedImage.image_url" 
            :alt="selectedImage.alt_text || currentWork.title"
            class="main-image"
            @click="openLightbox(selectedImageIndex)"
          >
          <button class="btn-fullscreen" @click="openLightbox(selectedImageIndex)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>

        <!-- Thumbnails -->
        <div v-if="currentWork.images.length > 1" class="thumbnails-container">
          <button
            v-for="(image, index) in currentWork.images"
            :key="image.id"
            class="thumbnail"
            :class="{ active: selectedImageIndex === index }"
            @click="selectImage(index)"
          >
            <img :src="image.image_url" :alt="image.alt_text || `Image ${index + 1}`">
          </button>
        </div>
      </section>

      <!-- Description -->
      <section v-if="currentWork.description" class="description-section">
        <h2>À propos du projet</h2>
        <div class="description-content">
          <p>{{ currentWork.description }}</p>
        </div>
      </section>

      <!-- Lightbox -->
      <Teleport to="body">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <button 
            v-if="currentWork.images.length > 1"
            class="lightbox-nav lightbox-prev" 
            @click="previousImage"
            :disabled="lightboxIndex === 0"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <img 
            :src="currentWork.images[lightboxIndex]?.image_url" 
            :alt="currentWork.images[lightboxIndex]?.alt_text"
            class="lightbox-image"
          >

          <button 
            v-if="currentWork.images.length > 1"
            class="lightbox-nav lightbox-next" 
            @click="nextImage"
            :disabled="lightboxIndex === currentWork.images.length - 1"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <div class="lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ currentWork.images.length }}
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorks } from '@/composables/useWorks'

const route = useRoute()
const { currentWork, loading, error, fetchWorkBySlug } = useWorks()

const selectedImageIndex = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const selectedImage = computed(() => {
  return currentWork.value?.images?.[selectedImageIndex.value] || 
         currentWork.value?.images?.[0] || 
         { image_url: '', alt_text: '' }
})

const selectImage = (index) => {
  selectedImageIndex.value = index
}

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const previousImage = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--
  }
}

const nextImage = () => {
  if (lightboxIndex.value < currentWork.value.images.length - 1) {
    lightboxIndex.value++
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Gestion du clavier pour la lightbox
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
</script>

<style scoped>
.work-detail-page {
  min-height: 100vh;
  background: #F8F9FA;
}

/* Loading & Error */
.loading-container,
.error-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #E9ECEF;
  border-top-color: #3A2665;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.2) 100%);
  border-radius: 50%;
  color: #DC3545;
  margin-bottom: 2rem;
}

.error-container h1 {
  color: #1E183A;
  margin-bottom: 1rem;
}

.error-container p {
  color: #6C757D;
  margin-bottom: 2rem;
}

/* Work Detail */
.work-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.breadcrumb-link {
  color: #3A2665;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #F59C1A;
}

.breadcrumb-separator {
  color: #CED4DA;
}

.breadcrumb-current {
  color: #6C757D;
}

/* Header */
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.work-header-content {
  flex: 1;
}

.work-category-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.work-title {
  font-size: 3rem;
  font-weight: 900;
  color: #1E183A;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
}

.work-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6C757D;
  font-size: 1rem;
}

.meta-item svg {
  flex-shrink: 0;
  color: #3A2665;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: white;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  color: #3A2665;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #3A2665;
  color: white;
  border-color: #3A2665;
  transform: translateX(-4px);
}

/* Galerie */
.gallery-section {
  margin-bottom: 4rem;
}

.main-image-container {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image {
  max-width: 100%;
  width: auto;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  cursor: zoom-in;
  display: block;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(58, 38, 101, 0.2);
}

.btn-fullscreen {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: #3A2665;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-fullscreen:hover {
  background: #F59C1A;
  color: white;
  transform: scale(1.1);
}

/* Thumbnails */
.thumbnails-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  padding: 0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #F59C1A;
  transform: translateY(-4px);
}

.thumbnail.active {
  border-color: #3A2665;
  box-shadow: 0 4px 15px rgba(58, 38, 101, 0.3);
}

/* Description */
.description-section {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(58, 38, 101, 0.08);
}

.description-section h2 {
  font-size: 2rem;
  color: #1E183A;
  margin: 0 0 1.5rem 0;
}

.description-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #495057;
}

.description-content p {
  margin: 0 0 1.5rem 0;
  white-space: pre-wrap;
}

.description-content p:last-child {
  margin-bottom: 0;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(30, 24, 58, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: #F59C1A;
  border-color: #F59C1A;
  transform: rotate(90deg);
}

.lightbox-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-nav:hover:not(:disabled) {
  background: #F59C1A;
  border-color: #F59C1A;
}

.lightbox-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

.lightbox-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-weight: 600;
}

/* Boutons globaux */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(58, 38, 101, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(58, 38, 101, 0.4);
}

.btn-lg {
  padding: 1.125rem 2.5rem;
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .work-detail {
    padding: 1rem;
  }

  .work-header {
    flex-direction: column;
  }

  .work-title {
    font-size: 2rem;
  }

  .description-section {
    padding: 2rem 1.5rem;
  }

  .thumbnail {
    width: 100px;
    height: 75px;
  }

  .lightbox-nav {
    width: 48px;
    height: 48px;
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }
}
</style>