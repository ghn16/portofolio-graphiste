<template>
  <AdminLayout>
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
          <div v-if="!work.images || work.images.length === 0" class="no-image-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Ajoutez des images</span>
          </div>
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

      <!-- Pagination -->
      <div v-if="works.length > itemsPerPage" class="pagination">
        <button 
          @click="previousPage" 
          :disabled="currentPage === 1"
          class="pagination-btn pagination-arrow"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Précédent
        </button>

        <div class="pagination-numbers">
          <button
            v-for="(page, index) in visiblePages"
            :key="index"
            @click="page !== '...' && goToPage(page)"
            :class="[
              'pagination-btn',
              { 'active': page === currentPage },
              { 'dots': page === '...' }
            ]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="pagination-btn pagination-arrow"
        >
          Suivant
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Info pagination -->
      <div v-if="works.length > 0" class="pagination-info">
        Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à 
        {{ Math.min(currentPage * itemsPerPage, works.length) }} 
        sur {{ works.length }} œuvre{{ works.length > 1 ? 's' : '' }}
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useWorks } from '@/composables/useWorks'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const { works, loading, fetchWorks, deleteWork } = useWorks(true)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(9) // 9 œuvres par page (grille 3x3)

const publishedCount = computed(() => 
  works.value.filter(w => w.status === 'published').length
)

const draftCount = computed(() => 
  works.value.filter(w => w.status === 'draft').length
)

// Calcul de la pagination
const totalPages = computed(() => 
  Math.ceil(works.value.length / itemsPerPage.value)
)

const paginatedWorks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return works.value.slice(start, end)
})

// Navigation pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

// Pages visibles (max 5 boutons)
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 5) {
    // Afficher toutes les pages si <= 5
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique pour afficher 5 pages max
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

const getCoverImage = (work) => {
  // Chercher l'image marquée comme cover
  const cover = work.images?.find(img => img.is_cover)
  if (cover?.image_url) return cover.image_url
  
  // Sinon prendre la première image
  if (work.images && work.images.length > 0 && work.images[0]?.image_url) {
    return work.images[0].image_url
  }
  
  // Placeholder SVG si aucune image
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%233A2665"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23F59C1A" font-size="24" font-family="Arial" font-weight="bold"%3EAucune image%3C/text%3E%3C/svg%3E'
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
  const confirmMessage = `⚠️ Supprimer "${title}" ?\n\n` +
    `Cette action supprimera :\n` +
    `• L'œuvre\n` +
    `• Toutes ses images\n` +
    `• Définitivement (irréversible)\n\n` +
    `Êtes-vous absolument sûr ?`
  
  if (confirm(confirmMessage)) {
    const loadingToast = document.createElement('div')
    loadingToast.className = 'delete-toast loading'
    loadingToast.textContent = 'Suppression en cours...'
    document.body.appendChild(loadingToast)
    
    try {
      const result = await deleteWork(id)
      
      loadingToast.remove()
      
      if (result.success) {
        // Toast de succès
        const successToast = document.createElement('div')
        successToast.className = 'delete-toast success'
        successToast.textContent = '✓ Œuvre supprimée avec succès'
        document.body.appendChild(successToast)
        
        setTimeout(() => successToast.remove(), 3000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      loadingToast.remove()
      
      // Toast d'erreur
      const errorToast = document.createElement('div')
      errorToast.className = 'delete-toast error'
      errorToast.textContent = '✗ Erreur lors de la suppression'
      document.body.appendChild(errorToast)
      
      setTimeout(() => errorToast.remove(), 3000)
      
      console.error('Erreur de suppression:', error)
    }
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

/* Header - RETIRÉ car maintenant dans AdminLayout */
.page-header {
  display: none;
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

.no-image-badge {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(58, 38, 101, 0.9);
  color: #F59C1A;
  font-weight: 600;
  font-size: 0.95rem;
  pointer-events: none;
}

.no-image-badge svg {
  opacity: 0.7;
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

/* Toasts de suppression */
:deep(.delete-toast) {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: slideInRight 0.3s ease;
}

:deep(.delete-toast.loading) {
  background: #3A2665;
  color: white;
}

:deep(.delete-toast.success) {
  background: #28A745;
  color: white;
}

:deep(.delete-toast.error) {
  background: #DC3545;
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Bouton flottant */
.btn-floating {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #F59C1A 0%, #D48310 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(245, 156, 26, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
}

.btn-floating:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 12px 32px rgba(245, 156, 26, 0.6);
}

.btn-floating svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-btn {
  min-width: 48px;
  height: 48px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  border: none;
  border-radius: 50%;
  color: #3A2665;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 8px rgba(58, 38, 101, 0.1);
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.pagination-btn:hover:not(:disabled):not(.dots) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(58, 38, 101, 0.25);
}

.pagination-btn:hover:not(:disabled):not(.dots)::before {
  opacity: 1;
}

.pagination-btn:hover:not(:disabled):not(.dots) svg {
  color: white;
  position: relative;
  z-index: 1;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #F59C1A 0%, #D48310 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(245, 156, 26, 0.4);
  transform: scale(1.1);
}

.pagination-btn.active::before {
  opacity: 0;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination-btn.dots {
  border: none;
  cursor: default;
  background: transparent;
  box-shadow: none;
}

.pagination-btn.dots:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

.pagination-btn.dots::before {
  display: none;
}

.pagination-arrow {
  font-size: 0.875rem;
  min-width: auto;
  padding: 0 1.25rem;
  border-radius: 24px;
  position: relative;
  z-index: 1;
}

.pagination-arrow svg {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.pagination-arrow:hover:not(:disabled) svg {
  animation: bounceArrow 0.6s ease;
}

@keyframes bounceArrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
}

.pagination-arrow:last-child:hover:not(:disabled) svg {
  animation: bounceArrowRight 0.6s ease;
}

@keyframes bounceArrowRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

.pagination-info {
  text-align: center;
  padding: 1rem;
  color: #6C757D;
  font-size: 0.95rem;
  font-weight: 500;
}

.pagination-info {
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.03) 0%, rgba(245, 156, 26, 0.03) 100%);
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-top: 1rem;
}
</style>