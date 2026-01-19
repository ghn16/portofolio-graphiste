<template>
  <router-link 
    :to="{ name: 'work-detail', params: { slug: work.slug } }"
    class="work-card"
  >
    <div class="work-image-wrapper">
      <img 
        :src="coverImage" 
        :alt="work.title"
        loading="lazy"
      >
      <div class="work-overlay">
        <span class="view-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </span>
      </div>
    </div>
    <div class="work-info">
      <span class="work-category">{{ work.category?.name }}</span>
      <h3 class="work-name">{{ work.title }}</h3>
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
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(58, 38, 101, 0.1);
  transition: all 0.4s ease;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(58, 38, 101, 0.2);
}

.work-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 133.33%;
  overflow: hidden;
  background: #EAEAEA;
}

.work-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-card:hover .work-image-wrapper img {
  transform: scale(1.1);
}

.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(58, 38, 101, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.work-card:hover .work-overlay {
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
  transition: transform 0.4s ease;
}

.work-card:hover .view-icon {
  transform: scale(1);
}

.work-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.work-category {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  border-radius: 20px;
  align-self: flex-start;
}

.work-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E183A;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .work-info {
    padding: 1rem;
  }
  
  .work-name {
    font-size: 1rem;
  }
  
  .work-category {
    font-size: 0.7rem;
    padding: 0.3rem 0.85rem;
  }

  .view-icon {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .work-info {
    padding: 0.75rem;
  }

  .work-name {
    font-size: 0.9rem;
  }

  .work-category {
    font-size: 0.65rem;
    padding: 0.25rem 0.75rem;
  }
}
</style>