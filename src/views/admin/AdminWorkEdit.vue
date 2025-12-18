<template>
  <div class="admin-works">
    <div class="page-header">
      <div>
        <h1>Mes œuvres</h1>
        <p class="subtitle">Gérez votre portfolio créatif</p>
      </div>
      <router-link to="/admin/works/new" class="btn btn-accent btn-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nouvelle œuvre
      </router-link>
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon published">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ publishedCount }}</h3>
          <p>Publiées</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon draft">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ draftCount }}</h3>
          <p>Brouillons</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ works.length }}</h3>
          <p>Total</p>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des œuvres...</p>
    </div>

    <!-- Liste vide -->
    <div v-else-if="works.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <h2>Aucune œuvre pour le moment</h2>
      <p>Commencez par créer votre première œuvre pour enrichir votre portfolio</p>
      <router-link to="/admin/works/new" class="btn btn-primary btn-lg">
        Créer ma première œuvre
      </router-link>
    </div>

    <!-- Grille des œuvres -->
    <div v-else class="works-grid">
      <div 
        v-for="work in works"
        :key="work.id"
        class="work-card"
      >
        <!-- Image -->
        <div class="work-image">
          <img 
            :src="getCoverImage(work)" 
            :alt="work.title"
          >
          <div class="work-overlay">
            <router-link 
              :to="`/admin/works/${work.id}/edit`"
              class="btn-icon btn-edit-overlay"
              title="Modifier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </router-link>
          </div>
          <span class="work-status" :class="work.status">
            {{ work.status === 'published' ? 'Publié' : 'Brouillon' }}
          </span>
        </div>

        <!-- Contenu -->
        <div class="work-content">
          <div class="work-header">
            <h3 class="work-title">{{ work.title }}</h3>
            <span v-if="work.category" class="work-category">
              {{ work.category.name }}
            </span>
          </div>

          <p v-if="work.description" class="work-description">
            {{ truncateDescription(work.description) }}
          </p>

          <div class="work-meta">
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {{ work.images?.length || 0 }} image{{ work.images?.length > 1 ? 's' : '' }}
            </span>
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ formatDate(work.created_at) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="work-actions">
            <router-link 
              :to="`/admin/works/${work.id}/edit`"
              class="btn btn-primary btn-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modifier
            </router-link>
            <button 
              @click="handleDelete(work.id, work.title)"
              class="btn btn-ghost btn-sm btn-danger"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useWorks } from '@/composables/useWorks'

const { works, loading, fetchWorks, deleteWork } = useWorks(true)

const publishedCount = computed(() => 
  works.value.filter(w => w.status === 'published').length
)

const draftCount = computed(() => 
  works.value.filter(w => w.status === 'draft').length
)

const getCoverImage = (work) => {
  const cover = work.images?.find(img => img.is_cover)
  return cover?.image_url || work.images?.[0]?.image_url || 'https://via.placeholder.com/400x300/3A2665/FFFFFF?text=Aucune+image'
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 120 
    ? description.substring(0, 120) + '...' 
    : description
}

const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

const handleDelete = async (id, title) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?\n\nCette action est irréversible.`)) {
    await deleteWork(id)
  }
}

onMounted(() => {
  fetchWorks()
})
</script>

<style scoped>
.admin-works {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1E183A;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #6C757D;
  margin: 0;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(58, 38, 101, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.published {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.2) 100%);
  color: #28A745;
}

.stat-icon.draft {
  background: linear-gradient(135deg, rgba(245, 156, 26, 0.1) 0%, rgba(245, 156, 26, 0.2) 100%);
  color: #F59C1A;
}

.stat-icon.total {
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.1) 0%, rgba(237, 0, 226, 0.1) 100%);
  color: #3A2665;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1E183A;
  margin: 0;
  line-height: 1;
}

.stat-content p {
  font-size: 0.875rem;
  color: #6C757D;
  margin: 0.25rem 0 0 0;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6C757D;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #F8F9FA;
  border-top-color: #3A2665;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(58, 38, 101, 0.08);
}

.empty-icon {
  display: inline-flex;
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.05) 0%, rgba(237, 0, 226, 0.05) 100%);
  border-radius: 50%;
  color: #3A2665;
  margin-bottom: 2rem;
}

.empty-state h2 {
  color: #1E183A;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #6C757D;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Grille des œuvres */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.work-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(58, 38, 101, 0.08);
  transition: all 0.3s ease;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(58, 38, 101, 0.15);
}

/* Image fixe */
.work-image {
  position: relative;
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(58, 38, 101, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.work-card:hover .work-overlay {
  opacity: 1;
}

.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  color: #3A2665;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #F59C1A;
  color: white;
  transform: scale(1.1);
}

.work-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
}

.work-status.published {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.work-status.draft {
  background: rgba(245, 156, 26, 0.9);
  color: white;
}

/* Contenu */
.work-content {
  padding: 1.5rem;
}

.work-header {
  margin-bottom: 1rem;
}

.work-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E183A;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.work-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.1) 0%, rgba(237, 0, 226, 0.1) 100%);
  color: #3A2665;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.work-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #6C757D;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #F8F9FA;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: #6C757D;
}

.meta-item svg {
  flex-shrink: 0;
}

/* Actions */
.work-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  justify-content: center;
}

.btn-sm {
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 1.75rem;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 38, 101, 0.3);
}

.btn-accent {
  background: linear-gradient(135deg, #F59C1A 0%, #D48310 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 156, 26, 0.3);
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 156, 26, 0.4);
}

.btn-ghost {
  background: transparent;
  color: #6C757D;
  border: 2px solid #E9ECEF;
}

.btn-ghost:hover {
  background: #F8F9FA;
  border-color: #DEE2E6;
}

.btn-danger:hover {
  background: rgba(220, 53, 69, 0.1);
  border-color: #DC3545;
  color: #DC3545;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-works {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-header .btn {
    width: 100%;
  }

  .works-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .work-actions {
    flex-direction: column;
  }
}
</style>