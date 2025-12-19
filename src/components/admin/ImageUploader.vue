<template>
  <div class="image-uploader" v-if="workId">
    <div 
      class="upload-zone"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input 
        type="file" 
        ref="fileInput"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      >
      
      <div v-if="!uploading" class="upload-prompt">
        <div class="upload-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h3>Glissez vos images ici</h3>
        <p>ou</p>
        <button 
          type="button" 
          class="btn btn-accent"
          @click="$refs.fileInput.click()"
        >
          Parcourir les fichiers
        </button>
        <p class="upload-hint">PNG, JPG, WebP jusqu'à 5MB</p>
      </div>

      <div v-else class="upload-progress">
        <div class="spinner"></div>
        <p>Upload en cours... {{ uploadProgress }}%</p>
      </div>
    </div>

    <!-- Message de succès temporaire -->
    <div v-if="uploadSuccess" class="upload-success-message">
      ✓ Image uploadée avec succès !
    </div>

    <div v-if="images.length" class="images-preview">
      <div 
        v-for="(image, index) in images" 
        :key="image.id"
        class="image-item"
      >
        <img :src="image.image_url" :alt="image.alt_text">
        <div class="image-actions">
          <button 
            type="button"
            class="btn-cover"
            :class="{ active: image.is_cover }"
            @click="$emit('set-cover', image.id)"
            title="Définir comme image de couverture"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <button 
            type="button"
            class="btn-delete"
            @click="$emit('delete', image.id, image.storage_path)"
            title="Supprimer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStorage } from '@/composables/useStorage'

const props = defineProps({
  workId: {
    type: String,
    required: false,
    default: null
  },
  images: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['upload-success', 'delete', 'set-cover'])

const { uploadImage, uploading } = useStorage()
const fileInput = ref(null)
const isDragging = ref(false)
const uploadSuccess = ref(false)
const uploadProgress = ref(0)

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  await uploadFiles(files)
}

const handleDrop = async (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  await uploadFiles(files)
}

const uploadFiles = async (files) => {
  if (!props.workId) {
    console.error('WorkId is required for upload')
    return
  }
  
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    
    uploading.value = true
    uploadSuccess.value = false
    uploadProgress.value = 0
    
    try {
      // Simuler la progression (Supabase ne fournit pas de vrai progress)
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10
        }
      }, 100)
      
      const result = await uploadImage(file, props.workId)
      
      clearInterval(progressInterval)
      uploadProgress.value = 100
      
      if (result.success) {
        console.log('Upload completed, emitting:', result.data)
        uploadSuccess.value = true
        
        // Émettre l'événement
        emit('upload-success', result.data)
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
          uploadSuccess.value = false
        }, 3000)
      }
    } catch (err) {
      console.error('Upload failed:', err)
      error.value = err.message
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }
  
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.upload-zone {
  border: 3px dashed #CED4DA;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-zone.is-dragging {
  border-color: #F59C1A;
  background: rgba(245, 156, 26, 0.05);
}

.upload-prompt h3 {
  color: #3A2665;
  margin-bottom: 0.5rem;
}

.upload-prompt p {
  color: #6C757D;
  margin: 0.5rem 0;
}

.upload-icon {
  display: inline-flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  border-radius: 50%;
  color: white;
  margin-bottom: 1.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  margin-top: 1rem !important;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(58, 38, 101, 0.15);
  transition: transform 0.3s ease;
}

.image-item:hover {
  transform: translateY(-4px);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.btn-cover,
.btn-delete {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.btn-cover:hover {
  background: #F59C1A;
  transform: scale(1.1);
}

.btn-cover.active {
  background: #F59C1A;
}

.btn-delete:hover {
  background: #DC3545;
  transform: scale(1.1);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #E9ECEF;
  border-top-color: #3A2665;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-success-message {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(40, 167, 69, 0.05) 100%);
  border: 2px solid rgba(40, 167, 69, 0.3);
  border-radius: 12px;
  color: #28A745;
  font-weight: 600;
  text-align: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>