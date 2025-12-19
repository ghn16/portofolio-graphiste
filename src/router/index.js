// ============================================
// FILE: src/router/index.js
// ============================================
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'

// Views publiques
import Home from '@/views/public/Home.vue'
import WorkDetail from '@/views/public/WorkDetail.vue'
import About from '@/views/public/About.vue'

// Views admin
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminWorks from '@/views/admin/AdminWorks.vue'
import AdminWorkEdit from '@/views/admin/AdminWorkEdit.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'

const routes = [
  // ============================================
  // ROUTES PUBLIQUES
  // ============================================
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { 
      title: 'Portfolio',
      public: true
    }
  },
  {
    path: '/work/:slug',
    name: 'work-detail',
    component: WorkDetail,
    meta: { 
      title: 'Œuvre',
      public: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { 
      title: 'À propos',
      public: true
    }
  },

  // ============================================
  // ROUTES ADMIN
  // ============================================
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
    meta: { 
      title: 'Connexion Admin',
      public: true,
      hideForAuth: true // Cache cette page si déjà connecté
    }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { 
      title: 'Tableau de bord',
      requiresAuth: true
    }
  },
  {
    path: '/admin/works',
    name: 'admin-works',
    component: AdminWorks,
    meta: { 
      title: 'Gestion des œuvres',
      requiresAuth: true
    }
  },
  {
    path: '/admin/works/new',
    name: 'admin-work-new',
    component: AdminWorkEdit,
    meta: { 
      title: 'Nouvelle œuvre',
      requiresAuth: true
    }
  },
  {
    path: '/admin/works/:id/edit',
    name: 'admin-work-edit',
    component: AdminWorkEdit,
    meta: { 
      title: 'Modifier l\'œuvre',
      requiresAuth: true
    }
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: AdminCategories,
    meta: { 
      title: 'Gestion des catégories',
      requiresAuth: true
    }
  },

  // ============================================
  // 404 - Page non trouvée
  // ============================================
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { 
      title: 'Page non trouvée',
      public: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ============================================
// NAVIGATION GUARDS
// ============================================

// Variable pour vérifier si l'auth est initialisée
let authInitialized = false

// Guard pour vérifier l'authentification
router.beforeEach(async (to, from, next) => {
  // Mettre à jour le titre de la page
  document.title = `${to.meta.title || 'Portfolio'} | Mon Portfolio`

  // Initialiser l'auth une seule fois
  if (!authInitialized) {
    const { data: { session } } = await supabase.auth.getSession()
    authInitialized = true
  }

  // Vérifier si la route nécessite une authentification
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // Vérifier l'état d'authentification
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Rediriger vers la page de connexion
      next({
        name: 'admin-login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.meta.hideForAuth) {
    // Cacher certaines pages (comme login) si déjà connecté
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

// ============================================
// UTILS: Navigation programmatique
// ============================================

// Fonction helper pour naviguer depuis les composables
export const navigateTo = (router, name, params = {}) => {
  router.push({ name, params })
}

// Fonction helper pour revenir en arrière
export const goBack = (router) => {
  router.back()
}