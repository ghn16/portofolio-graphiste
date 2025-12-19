<template>
  <router-link 
    :to="{ name: 'work-detail', params: { slug: work.slug } }"
    class="work-card"
  >
    <div class="work-card__image">
      <img 
        :src="coverImage" 
        :alt="work.title"
        loading="lazy"
      >
      <div class="work-card__overlay">
        <span class="view-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </span>
      </div>
    </div>
    <div class="work-card__content">
      <span class="work-card__category">{{ work.category?.name }}</span>
      <h3 class="work-card__title">{{ work.title }}</h3>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  work: {
    type: Object,
    required: true
  }
})

const coverImage = computed(() => {
  const cover = props.work.images?.find(img => img.is_cover)
  return cover?.image_url || props.work.images?.[0]?.image_url || '/placeholder.jpg'
})
</script>

<style scoped>
.work-card {
  display: block;
  position: relative;
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(58, 38, 101, 0.1);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.work-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(58, 38, 101, 0.2);
}

.work-card__image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
}

.work-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-card:hover .work-card__image img {
  transform: scale(1.1);
}

.work-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(58, 38, 101, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.work-card:hover .work-card__overlay {
  opacity: 1;
}

.view-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 156, 26, 0.95);
  border-radius: 50%;
  color: white;
  transform: scale(0);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.work-card:hover .view-icon {
  transform: scale(1);
}

.work-card__content {
  padding: 1.5rem;
}

.work-card__category {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 0.75rem;
}

.work-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E183A;
  margin: 0;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .work-card__content {
    padding: 1.25rem;
  }
  
  .work-card__title {
    font-size: 1.1rem;
  }
}
</style>
