<template>
  <div class="admin-dashboard">
    
    <div class="stats">
      <div class="stat-card">
        <h3>{{ publishedWorks.length }}</h3>
        <p>Œuvres publiées</p>
      </div>
      <div class="stat-card">
        <h3>{{ draftWorks.length }}</h3>
        <p>Brouillons</p>
      </div>
      <div class="stat-card">
        <h3>{{ categories.length }}</h3>
        <p>Catégories</p>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Actions rapides</h2>
      <router-link to="/admin/works/new" class="btn-primary">
        Nouvelle œuvre
      </router-link>
      <router-link to="/admin/categories" class="btn-secondary">
        Gérer les catégories
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useWorks } from '@/composables/useWorks'
import { useCategories } from '@/composables/useCategories'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const { works, fetchWorks } = useWorks(true)
const { categories, fetchCategories } = useCategories()

const publishedWorks = computed(() => 
  works.value.filter(w => w.status === 'published')
)
const draftWorks = computed(() => 
  works.value.filter(w => w.status === 'draft')
)

onMounted(async () => {
  await Promise.all([
    fetchWorks(),
    fetchCategories()
  ])
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.quick-actions {
  margin-top: 3rem;
}

.quick-actions h2 {
  margin-bottom: 1rem;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-right: 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}
</style>
