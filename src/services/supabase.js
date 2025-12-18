import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Variables d\'environnement Supabase manquantes!')
  console.log('Créez un fichier .env.local avec:')
  console.log('VITE_SUPABASE_URL=...')
  console.log('VITE_SUPABASE_ANON_KEY=...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
