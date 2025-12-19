import { supabase } from './supabase'

export const storageService = {
  async uploadImage(file, workId) {
    try {
      const fileExt = file.name.split('.').pop().toLowerCase()
      const fileName = `${workId}/${Date.now()}.${fileExt}`
      
      console.log('Uploading to:', fileName)
      console.log('File type:', file.type)
      console.log('File size:', file.size)
      
      // Upload le fichier
      const { data, error } = await supabase.storage
        .from('works-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })
      
      if (error) {
        console.error('Upload error:', error)
        throw error
      }
      
      console.log('Upload success:', data)
      
      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('works-images')
        .getPublicUrl(fileName)
      
      console.log('Public URL:', publicUrl)
      
      return {
        url: publicUrl,
        path: fileName
      }
    } catch (error) {
      console.error('Storage service error:', error)
      throw error
    }
  },

  async deleteImage(path) {
    const { error } = await supabase.storage
      .from('works-images')
      .remove([path])
    
    if (error) throw error
  },

  async addImageToWork(workId, imageUrl, storagePath, altText = '', isCover = false) {
    // Si on définit une nouvelle cover, retirer le statut des autres
    if (isCover) {
      await supabase
        .from('work_images')
        .update({ is_cover: false })
        .eq('work_id', workId)
    }

    const { data, error } = await supabase
      .from('work_images')
      .insert([{
        work_id: workId,
        image_url: imageUrl,
        storage_path: storagePath,
        alt_text: altText,
        is_cover: isCover
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateImageCover(imageId, workId) {
    // Retirer le statut cover de toutes les images de ce work
    await supabase
      .from('work_images')
      .update({ is_cover: false })
      .eq('work_id', workId)

    // Définir cette image comme cover
    const { data, error } = await supabase
      .from('work_images')
      .update({ is_cover: true })
      .eq('id', imageId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeImageFromWork(imageId, storagePath) {
    // Supprimer du storage
    await this.deleteImage(storagePath)
    
    // Supprimer de la base de données
    const { error } = await supabase
      .from('work_images')
      .delete()
      .eq('id', imageId)
    
    if (error) throw error
  }
}