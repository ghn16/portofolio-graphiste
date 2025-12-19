<template>
  <div class="admin-work-edit">
    <div class="page-header">
      <button @click="$router.back()" class="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour
      </button>
      <h1>{{ isNew ? 'Nouvelle œuvre' : 'Modifier l\'œuvre' }}</h1>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <!-- Titre -->
        <div class="form-group">
          <label for="title">Titre *</label>
          <input 
            id="title"
            v-model="form.title" 
            type="text" 
            class="form-input"
            placeholder="Ex: Logo pour entreprise tech"
            required
          >
        </div>

        <!-- Catégorie -->
        <div class="form-group">
          <label for="category">Catégorie *</label>
          <div class="category-select-wrapper">
            <select 
              id="category"
              v-model="form.category_id" 
              class="form-select"
              required
            >
              <option value="">Sélectionner une catégorie...</option>
              <option 
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <router-link to="/admin/categories" class="btn-manage-categories">
              Gérer les catégories
            </router-link>
          </div>
          <p v-if="categories.length === 0" class="form-hint warning">
            ⚠️ Aucune catégorie disponible. 
            <router-link to="/admin/categories">Créez-en une d'abord</router-link>
          </p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="form.description" 
            class="form-textarea"
            rows="6"
            placeholder="Décrivez votre projet, le contexte, les défis relevés..."
          ></textarea>
        </div>

        <!-- Statut -->
        <div class="form-group">
          <label for="status">Statut</label>
          <select 
            id="status"
            v-model="form.status" 
            class="form-select"
          >
            <option value="draft">Brouillon (non visible publiquement)</option>
            <option value="published">Publié (visible sur le site)</option>
          </select>
        </div>

        <!-- Upload d'images -->
        <div class="form-group" v-if="savedWorkId || (!isNew && currentWork?.id)">
          <label>Images du projet</label>
          <ImageUploader 
            :work-id="savedWorkId || currentWork.id"
            :images="workImages"
            @upload-success="handleImageUpload"
            @delete="handleImageDelete"
            @set-cover="handleSetCover"
          />
          <p class="form-hint">
            💡 Cliquez sur l'étoile pour définir l'image de couverture
          </p>
        </div>

        <div v-else class="info-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <p>Créez d'abord l'œuvre, puis vous pourrez ajouter des images</p>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            :disabled="saving || categories.length === 0"
          >
            {{ saving ? 'Enregistrement...' : (isNew ? 'Créer l\'œuvre' : 'Enregistrer les modifications') }}
          </button>
          <button 
            type="button" 
            @click="$router.back()" 
            class="btn btn-ghost btn-lg"
          >
            Annuler
          </button>
          
          <!-- Bouton supprimer (uniquement en mode édition) -->
          <button 
            v-if="!isNew"
            type="button" 
            @click="handleDeleteWork" 
            class="btn btn-danger btn-lg"
          >
            Supprimer l'œuvre
          </button>
        </div>

        <!-- Message de succès/erreur -->
        <div v-if="successMessage" class="alert alert-success">
          ✓ {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          ✗ {{ errorMessage }}
          <details style="margin-top: 0.5rem; font-size: 0.875rem;">
            <summary style="cursor: pointer;">Détails techniques</summary>
            <pre style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.1); border-radius: 4px; overflow-x: auto;">{{ errorMessage }}</pre>
          </details>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorks } from '@/composables/useWorks'
import { useCategories } from '@/composables/useCategories'
import { storageService } from '@/services/storageService'
import { slugify } from '@/utils/slugify'
import ImageUploader from '@/components/admin/ImageUploader.vue'

const route = useRoute()
const router = useRouter()
const { createWork, updateWork, fetchWorkById, currentWork, deleteWork } = useWorks(true)
const { categories, fetchCategories } = useCategories()

const isNew = computed(() => route.name === 'admin-work-new')
const savedWorkId = ref(null)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  title: '',
  slug: '',
  description: '',
  category_id: '',
  status: 'draft'
})

const workImages = ref([])

const handleSubmit = async () => {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Générer un slug UNIQUE avec timestamp dès le départ
    const baseSlug = slugify(form.value.title)
    
    // Pour une nouvelle œuvre, toujours ajouter un timestamp pour garantir l'unicité
    if (isNew.value) {
      form.value.slug = `${baseSlug}-${Date.now()}`
    } else {
      // Pour une modification, garder le slug existant
      form.value.slug = currentWork.value?.slug || baseSlug
    }
    
    // Ajouter published_at si on publie
    if (form.value.status === 'published' && !form.value.published_at) {
      form.value.published_at = new Date().toISOString()
    }

    if (isNew.value) {
      // Création
      const result = await createWork(form.value)
      if (result.success) {
        savedWorkId.value = result.data.id
        
        // Message de succès persistant
        successMessage.value = '✓ Œuvre créée avec succès ! Vous pouvez maintenant ajouter des images.'
        
        // Scroll vers le haut pour voir le message
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
        // Mettre à jour l'URL sans recharger
        window.history.replaceState({}, '', `/admin/works/${result.data.id}/edit`)
        
        // Ne pas effacer le message automatiquement
      } else {
        errorMessage.value = result.error || 'Erreur lors de la création'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Modification
      const result = await updateWork(route.params.id, form.value)
      if (result.success) {
        successMessage.value = '✓ Modifications enregistrées avec succès !'
        setTimeout(() => {
          router.push('/admin/works')
        }, 1500)
      } else {
        errorMessage.value = result.error || 'Erreur lors de la modification'
      }
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error)
    errorMessage.value = error.message || 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}

const handleImageUpload = async (imageData) => {
  try {
    const workId = savedWorkId.value || route.params.id
    
    console.log('Adding image to work:', workId, imageData)
    
    // Ajouter l'image à la base de données
    const result = await storageService.addImageToWork(
      workId,
      imageData.url,
      imageData.path,
      '',
      workImages.value.length === 0 // Première image = cover par défaut
    )
    
    if (result.success) {
      // Ajouter l'image à la liste locale IMMÉDIATEMENT
      workImages.value.push(result.data)
      
      // Message de succès
      successMessage.value = '✓ Image ajoutée avec succès'
      
      // Effacer le message après 3 secondes
      setTimeout(() => { 
        successMessage.value = '' 
      }, 3000)
      
      console.log('Image added successfully:', result.data)
      console.log('Total images:', workImages.value.length)
    } else {
      errorMessage.value = 'Erreur lors de l\'ajout de l\'image'
    }
  } catch (error) {
    console.error('Error in handleImageUpload:', error)
    errorMessage.value = 'Erreur lors de l\'ajout de l\'image'
  }
}

const handleImageDelete = async (imageId, storagePath) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return
  
  try {
    const result = await storageService.removeImageFromWork(imageId, storagePath)
    if (result.success) {
      workImages.value = workImages.value.filter(img => img.id !== imageId)
      successMessage.value = '✓ Image supprimée'
      setTimeout(() => { successMessage.value = '' }, 3000)
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression'
  }
}

const handleSetCover = async (imageId) => {
  try {
    const workId = savedWorkId.value || route.params.id
    
    // Mettre à jour via le service
    await storageService.updateImageCover(imageId, workId)
    
    // Mettre à jour localement
    workImages.value = workImages.value.map(img => ({
      ...img,
      is_cover: img.id === imageId
    }))
    
    successMessage.value = '✓ Image de couverture définie'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour'
  }
}

const handleDeleteWork = async () => {
  const confirmMessage = `⚠️ ATTENTION : Suppression définitive\n\n` +
    `Cette action supprimera :\n` +
    `• L'œuvre "${form.value.title}"\n` +
    `• Toutes ses images (${workImages.value.length})\n` +
    `• De manière IRRÉVERSIBLE\n\n` +
    `Tapez "SUPPRIMER" pour confirmer :`
  
  const userInput = prompt(confirmMessage)
  
  if (userInput === 'SUPPRIMER') {
    saving.value = true
    try {
      const result = await deleteWork(route.params.id)
      if (result.success) {
        alert('✓ Œuvre supprimée avec succès')
        router.push('/admin/works')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      errorMessage.value = 'Erreur lors de la suppression : ' + error.message
    } finally {
      saving.value = false
    }
  } else if (userInput !== null) {
    alert('❌ Suppression annulée : vous devez taper exactement "SUPPRIMER"')
  }
}

onMounted(async () => {
  await fetchCategories()
  
  if (!isNew.value) {
    await fetchWorkById(route.params.id)
    if (currentWork.value) {
      form.value = {
        title: currentWork.value.title,
        slug: currentWork.value.slug,
        description: currentWork.value.description || '',
        category_id: currentWork.value.category_id,
        status: currentWork.value.status,
        published_at: currentWork.value.published_at
      }
      // Copier les images
      workImages.value = [...(currentWork.value.images || [])]
      savedWorkId.value = currentWork.value.id
      
      console.log('Work loaded with images:', workImages.value.length)
    }
  }
})
</script>

<style scoped>
.admin-work-edit {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #3A2665;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.btn-back:hover {
  color: #F59C1A;
  transform: translateX(-4px);
}

.page-header h1 {
  color: #1E183A;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(58, 38, 101, 0.1);
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1E183A;
  font-size: 1rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  color: #1E183A;
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3A2665;
  background: white;
  box-shadow: 0 0 0 4px rgba(58, 38, 101, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.6;
}

.category-select-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.category-select-wrapper .form-select {
  flex: 1;
}

.btn-manage-categories {
  padding: 0.875rem 1.5rem;
  background: #F8F9FA;
  color: #3A2665;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.btn-manage-categories:hover {
  background: #3A2665;
  color: white;
  border-color: #3A2665;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6C757D;
}

.form-hint.warning {
  color: #F59C1A;
}

.form-hint a {
  color: #3A2665;
  font-weight: 600;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.05) 0%, rgba(237, 0, 226, 0.05) 100%);
  border: 2px solid rgba(58, 38, 101, 0.1);
  border-radius: 12px;
  color: #3A2665;
}

.info-box svg {
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #F8F9FA;
}

.btn {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(58, 38, 101, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(58, 38, 101, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-ghost {
  background: transparent;
  color: #6C757D;
}

.btn-ghost:hover {
  background: #F8F9FA;
  color: #3A2665;
}

.btn-danger {
  background: white;
  color: #DC3545;
  border: 2px solid #DC3545;
  margin-left: auto;
}

.btn-danger:hover {
  background: #DC3545;
  color: white;
}

.btn-lg {
  padding: 1rem 2.5rem;
}

.alert {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(40, 167, 69, 0.05) 100%);
  color: #28A745;
  border: 2px solid rgba(40, 167, 69, 0.3);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
}

.alert-error {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.05) 100%);
  color: #DC3545;
  border: 2px solid rgba(220, 53, 69, 0.3);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-work-edit {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .category-select-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-manage-categories {
    width: 100%;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>