<template>
  <div class="admin-works">
    <div class="header">
      <h1>Mes œuvres</h1>
      <router-link to="/admin/works/new" class="btn-primary">
        + Nouvelle œuvre
      </router-link>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else class="works-list">
      <div 
        v-for="work in works"
        :key="work.id"
        class="work-item"
      >
        <img 
          :src="work.images?.[0]?.image_url || '/placeholder.jpg'" 
          :alt="work.title"
        >
        <div class="work-info">
          <h3>{{ work.title }}</h3>
          <span class="status" :class="work.status">
            {{ work.status === 'published' ? 'Publié' : 'Brouillon' }}
          </span>
        </div>
        <div class="work-actions">
          <router-link 
            :to="`/admin/works/${work.id}/edit`"
            class="btn-edit"
          >
            Modifier
          </router-link>
          <button 
            @click="handleDelete(work.id)"
            class="btn-delete"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWorks } from '@/composables/useWorks'

const { works, loading, fetchWorks, deleteWork } = useWorks(true)

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.work-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.work-info {
  flex: 1;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status.published {
  background: #d4edda;
  color: #155724;
}

.status.draft {
  background: #fff3cd;
  color: #856404;
}

.work-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}
</style>