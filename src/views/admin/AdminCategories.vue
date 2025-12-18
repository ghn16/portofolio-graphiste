<template>
  <div class="admin-categories">
    <h1>Catégories</h1>

    <div class="add-category">
      <input 
        v-model="newCategory"
        type="text"
        placeholder="Nouvelle catégorie..."
        @keyup.enter="handleAdd"
      >
      <button @click="handleAdd" class="btn-primary">Ajouter</button>
    </div>

    <div class="categories-list">
      <div 
        v-for="category in categories"
        :key="category.id"
        class="category-item"
      >
        <span>{{ category.name }}</span>
        <button @click="handleDelete(category.id)" class="btn-delete">
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { slugify } from '@/utils/slugify'

const { categories, fetchCategories, createCategory, deleteCategory } = useCategories()
const newCategory = ref('')

const handleAdd = async () => {
  if (!newCategory.value.trim()) return
  
  await createCategory({
    name: newCategory.value,
    slug: slugify(newCategory.value)
  })
  
  newCategory.value = ''
}

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    await deleteCategory(id)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.admin-categories {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.add-category {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.add-category input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-delete {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>