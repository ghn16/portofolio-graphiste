import { supabase } from './supabase'

export const worksService = {
 // Récupérer toutes les œuvres publiées (public)
async getPublished(categoryId = null) {
  let query = supabase
    .from('works')
    .select(`
      *,
      category:categories(*),
      images:work_images(*)
    `)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false })
  
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  const { data, error } = await query
  if (error) throw error
  
  // Trier les images de chaque work par display_order
  if (data) {
    data.forEach(work => {
      if (work.images) {
        work.images.sort((a, b) => a.display_order - b.display_order)
      }
    })
  }
  
  return data || []
},

  // Récupérer une œuvre par slug (public)
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('works')
      .select(`
        *,
        category:categories(*),
        images:work_images(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return data
  },

  // Récupérer toutes les œuvres (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('works')
      .select(`
        *,
        category:categories(*),
        images:work_images(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Récupérer une œuvre par ID (admin)
  async getById(id) {
    const { data, error } = await supabase
      .from('works')
      .select(`
        *,
        category:categories(*),
        images:work_images(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Créer une œuvre (admin)
  async create(workData) {
    // Nettoyer les données avant insertion
    const cleanData = {
      title: workData.title,
      slug: workData.slug, // Le slug arrive déjà avec timestamp
      description: workData.description || null,
      category_id: workData.category_id || null,
      status: workData.status || 'draft',
      published_at: workData.status === 'published' ? new Date().toISOString() : null,
      featured: workData.featured || false,
      display_order: workData.display_order || 0
    }

    const { data, error } = await supabase
      .from('works')
      .insert([cleanData])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return data
  },

  // Mettre à jour une œuvre (admin)
  async update(id, updates) {
    // Si on passe en published et qu'il n'y a pas de published_at
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('works')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer une œuvre (admin)
  async delete(id) {
    // 1. Récupérer toutes les images liées à cette œuvre
    const { data: images } = await supabase
      .from('work_images')
      .select('storage_path')
      .eq('work_id', id)
    
    // 2. Supprimer les images du storage
    if (images && images.length > 0) {
      const paths = images.map(img => img.storage_path)
      await supabase.storage
        .from('works-images')
        .remove(paths)
    }
    
    // 3. Supprimer l'œuvre (les images liées seront supprimées via CASCADE)
    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}