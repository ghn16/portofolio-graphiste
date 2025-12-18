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
  // Routes publiques
  { path: '/', name: 'home', component: Home, meta: { title: 'Portfolio', public: true } },
  { path: '/work/:slug', name: 'work-detail', component: WorkDetail, meta: { title: 'Œuvre', public: true } },
  { path: '/about', name: 'about', component: About, meta: { title: 'À propos', public: true } },

  // Routes admin
  { path: '/naomie', name: 'admin-login', component: AdminLogin, meta: { title: 'Connexion Admin', public: true, hideForAuth: true } },
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Tableau de bord', requiresAuth: true } },
  { path: '/admin/works', name: 'admin-works', component: AdminWorks, meta: { title: 'Gestion des œuvres', requiresAuth: true } },
  { path: '/admin/works/new', name: 'admin-work-new', component: AdminWorkEdit, meta: { title: 'Nouvelle œuvre', requiresAuth: true } },
  { path: '/admin/works/:id/edit', name: 'admin-work-edit', component: AdminWorkEdit, meta: { title: 'Modifier l\'œuvre', requiresAuth: true } },
  { path: '/admin/categories', name: 'admin-categories', component: AdminCategories, meta: { title: 'Gestion des catégories', requiresAuth: true } },

  // 404 - Page non trouvée
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue'), meta: { title: 'Page non trouvée', public: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// ============================================
// NAVIGATION GUARDS
// ============================================

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title || 'Portfolio'} | Mon Portfolio`

  // Une seule requête pour la session Supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (to.matched.some(record => record.meta.requiresAuth) && !session) {
    next({ name: 'admin-login', query: { redirect: to.fullPath } })
  } else if (to.meta.hideForAuth && session) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router

// ============================================
// UTILS
// ============================================

export const navigateTo = (router, name, params = {}) => router.push({ name, params })
export const goBack = (router) => router.back()
