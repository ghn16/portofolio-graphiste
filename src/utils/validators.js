export const validators = {
  required: (value) => {
    return !!value || 'Ce champ est requis'
  },

  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email invalide'
  },

  minLength: (min) => (value) => {
    return (value && value.length >= min) || `Minimum ${min} caractères`
  },

  maxLength: (max) => (value) => {
    return (!value || value.length <= max) || `Maximum ${max} caractères`
  },

  imageFile: (file) => {
    if (!file) return 'Fichier requis'
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return 'Format d\'image invalide (JPEG, PNG, WebP, GIF uniquement)'
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return 'L\'image ne doit pas dépasser 5MB'
    }
    
    return true
  }
}

// Fonction helper pour valider un objet entier
export function validateForm(data, rules) {
  const errors = {}
  
  for (const field in rules) {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]]
    
    for (const rule of fieldRules) {
      const result = rule(data[field])
      if (result !== true) {
        errors[field] = result
        break
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ============================================
// FILE: src/utils/imageHelpers.js
// Helpers pour manipulation d'images
// ============================================

// Compresser une image avant upload
export async function compressImage(file, maxWidth = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Redimensionner si nécessaire
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }))
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Prévisualiser une image avant upload
export function previewImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Calculer les dimensions pour un thumbnail
export function calculateThumbnailSize(width, height, maxSize = 300) {
  const ratio = width / height
  
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / ratio)
    }
  } else {
    return {
      width: Math.round(maxSize * ratio),
      height: maxSize
    }
  }
}