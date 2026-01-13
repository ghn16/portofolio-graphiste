<template>
  <div class="home">
    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title fade-in">
          <span class="text-gradient">NAO</span>
          <br>
          <span class="text-gradient">GRAPHICS</span>
        </h1>
        <p class="hero-subtitle slide-up">
          Graphiste créatif spécialisé dans la création d'identités visuelles<br>
          modernes et percutantes
        </p>
        <div class="hero-actions">
          <a href="#works" class="btn btn-accent btn-lg">
            Découvrir mes créations
          </a>
          <a href="#contact" class="btn btn-outline btn-lg">
            Me contacter
          </a>
        </div>
      </div>
      <div class="hero-decoration"></div>
    </header>

    <!-- Filtres de catégories - Version améliorée -->
    <section class="filters-section">
      <div class="container">
        <!-- Mobile: Select dropdown -->
        <select v-model="selectedCategory" @change="currentPage = 1" class="mobile-filter">
          <option :value="null">Tous les projets ({{ works.length }})</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }} ({{ getCategoryCount(cat.id) }})
          </option>
        </select>

        <!-- Desktop: Scroll horizontal avec chips -->
        <div class="filters-desktop">
          <button @click="scrollLeft" v-show="canScrollLeft" class="scroll-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <div class="filters-scroll" ref="filtersContainer" @scroll="checkScroll">
            <button 
              :class="['filter-chip', { active: !selectedCategory }]"
              @click="selectCategory(null)"
            >
              <span>Tous</span>
              <span class="badge">{{ works.length }}</span>
            </button>
            <button 
              v-for="cat in categories" :key="cat.id"
              :class="['filter-chip', { active: selectedCategory === cat.id }]"
              @click="selectCategory(cat.id)"
            >
              <span>{{ cat.name }}</span>
              <span class="badge">{{ getCategoryCount(cat.id) }}</span>
            </button>
          </div>

          <button @click="scrollRight" v-show="canScrollRight" class="scroll-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Grille d'œuvres -->
    <section id="works" class="works-section">
      <div class="container">
        <!-- En-tête avec résultats -->
        <div class="works-header">
          <h2 class="works-title">{{ selectedCategoryName }}</h2>
          <p class="works-count">{{ filteredWorks.length }} projet{{ filteredWorks.length > 1 ? 's' : '' }}</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Chargement des projets...</p>
        </div>
        
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="filteredWorks.length === 0" class="empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>Aucun projet disponible pour cette catégorie</p>
        </div>

        <div v-else class="works-grid">
          <WorkCard 
            v-for="work in paginatedWorks"
            :key="work.id"
            :work="work"
            class="scale-in"
          />
        </div>

        <!-- Info de pagination -->
        <div v-if="filteredWorks.length > 0" class="pagination-info">
          <p>
            Affichage de 
            <strong>{{ (currentPage - 1) * itemsPerPage + 1 }}</strong>
            à 
            <strong>{{ Math.min(currentPage * itemsPerPage, filteredWorks.length) }}</strong>
            sur 
            <strong>{{ filteredWorks.length }}</strong>
            projet{{ filteredWorks.length > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Pagination améliorée -->
        <nav v-if="totalPages > 1" class="pagination" role="navigation" aria-label="Pagination">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="page-btn prev"
            aria-label="Page précédente"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span>Précédent</span>
          </button>

          <div class="page-numbers">
            <template v-if="totalPages <= 7">
              <!-- Afficher toutes les pages si <= 7 -->
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="goToPage(page)"
                :class="['page-btn', 'page-num', { active: page === currentPage }]"
                :aria-label="'Page ' + page"
                :aria-current="page === currentPage ? 'page' : null"
              >
                {{ page }}
              </button>
            </template>

            <template v-else>
              <!-- Pagination intelligente pour > 7 pages -->
              <button 
                @click="goToPage(1)"
                :class="['page-btn', 'page-num', { active: currentPage === 1 }]"
                aria-label="Page 1"
                :aria-current="currentPage === 1 ? 'page' : null"
              >
                1
              </button>

              <span v-if="currentPage > 3" class="ellipsis" aria-hidden="true">...</span>

              <button 
                v-for="page in middlePages" 
                :key="page"
                @click="goToPage(page)"
                :class="['page-btn', 'page-num', { active: page === currentPage }]"
                :aria-label="'Page ' + page"
                :aria-current="page === currentPage ? 'page' : null"
              >
                {{ page }}
              </button>

              <span v-if="currentPage < totalPages - 2" class="ellipsis" aria-hidden="true">...</span>

              <button 
                @click="goToPage(totalPages)"
                :class="['page-btn', 'page-num', { active: currentPage === totalPages }]"
                :aria-label="'Page ' + totalPages"
                :aria-current="currentPage === totalPages ? 'page' : null"
              >
                {{ totalPages }}
              </button>
            </template>
          </div>

          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="page-btn next"
            aria-label="Page suivante"
          >
            <span>Suivant</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </nav>
      </div>
    </section>

    <!-- Section Contact -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2>Travaillons ensemble</h2>
            <p class="contact-description">
              Vous avez un projet en tête ? Je serais ravi d'en discuter avec vous
              et de donner vie à vos idées créatives.
            </p>
            
            <div class="contact-methods">
              <a href="mailto:contact@naographics.com" class="contact-method">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div class="method-content">
                  <h3>Email</h3>
                  <p>gbehouenounaomietracy@gmail.com</p>
                </div>
              </a>

              <a href="tel:+22900000000" class="contact-method">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div class="method-content">
                  <h3>Téléphone</h3>
                  <p>+229 0161819192</p>
                </div>
              </a>

              <a href="https://www.instagram.com/naographics23?igsh=MW5raGRqcTF5bW9h" target="_blank" class="contact-method">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div class="method-content">
                  <h3>Instagram</h3>
                  <p>@naographics</p>
                </div>
              </a>
            </div>
          </div>

          <div class="contact-form-container">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <h3>Envoyez-moi un message</h3>
              
              <div class="form-group">
                <input 
                  v-model="form.name"
                  type="text" 
                  placeholder="Votre nom"
                  required
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <input 
                  v-model="form.email"
                  type="email" 
                  placeholder="Votre email"
                  required
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <textarea 
                  v-model="form.message"
                  placeholder="Votre message"
                  required
                  rows="5"
                  class="form-textarea"
                ></textarea>
              </div>

              <button type="submit" class="btn btn-accent btn-lg btn-full">
                Envoyer le message
              </button>

              <p v-if="formMessage" class="form-message" :class="formSuccess ? 'success' : 'error'">
                {{ formMessage }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h2 class="footer-logo">
              <span class="text-gradient">NAO GRAPHICS</span>
            </h2>
            <p>Créativité & Excellence depuis 2022</p>
          </div>

          <div class="footer-links">
            <div class="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#works">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#about">À propos</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#works">Branding</a></li>
                <li><a href="#works">Logo Design</a></li>
                <li><a href="#works">UI/UX</a></li>
                <li><a href="#works">Print Design</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Suivez-moi</h4>
              <div class="social-links">
                <a href="https://www.instagram.com/naographics23?igsh=MW5raGRqcTF5bW9h" target="_blank" class="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://www.behance.net/naomietracy" target="_blank" class="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/naographics" target="_blank" class="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2025 NAO Graphics. Tous droits réservés.</p>
          <p class="footer-credit">
            Conçu & développé par 
            <a href="https://github.com/ghn16" target="_blank">GBEHOUENOU Silvio</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useWorks } from '@/composables/useWorks'
import { useCategories } from '@/composables/useCategories'
import WorkCard from '@/components/public/WorkCard.vue'

const { works, loading, error, fetchWorks } = useWorks()
const { categories, fetchCategories } = useCategories()
const selectedCategory = ref(null)
const filtersContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6 // Réduit à 6 pour voir la pagination plus vite (augmenter à 12 en production)

const filteredWorks = computed(() => {
  if (!selectedCategory.value) return works.value
  return works.value.filter(w => w.category_id === selectedCategory.value)
})

const totalPages = computed(() => 
  Math.ceil(filteredWorks.value.length / itemsPerPage)
)

const paginatedWorks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredWorks.value.slice(start, start + itemsPerPage)
})

// Pages du milieu pour la pagination
const middlePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages = []
  
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return 'Tous les projets'
  return categories.value.find(c => c.id === selectedCategory.value)?.name || 'Tous les projets'
})

const getCategoryCount = (catId) => {
  return works.value.filter(w => w.category_id === catId).length
}

const selectCategory = (catId) => {
  selectedCategory.value = catId
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Gestion scroll horizontal des filtres
const checkScroll = () => {
  const el = filtersContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 10
}

const scrollLeft = () => {
  filtersContainer.value?.scrollBy({ left: -250, behavior: 'smooth' })
}

const scrollRight = () => {
  filtersContainer.value?.scrollBy({ left: 250, behavior: 'smooth' })
}

// Formulaire de contact
const form = ref({
  name: '',
  email: '',
  message: ''
})
const formMessage = ref('')
const formSuccess = ref(false)

const handleSubmit = () => {
  formSuccess.value = true
  formMessage.value = 'Message envoyé avec succès ! Je vous répondrai bientôt.'
  
  setTimeout(() => {
    form.value = { name: '', email: '', message: '' }
    formMessage.value = ''
  }, 3000)
}

onMounted(async () => {
  await Promise.all([fetchWorks(), fetchCategories()])
  await nextTick()
  checkScroll()
})
</script>
<style scoped>
/* ===== HERO SECTION ===== */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1E183A 0%, #3A2665 50%, #ED00E2 100%);
  overflow: hidden;
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero-decoration {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(245, 156, 26, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-50px, 50px); }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.text-gradient {
  background: linear-gradient(135deg, #F59C1A 0%, #FFB84D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem);
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  animation-delay: 0.2s;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation-delay: 0.4s;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-accent {
  background: linear-gradient(135deg, #F59C1A 0%, #D48310 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(245, 156, 26, 0.4);
}

.btn-accent:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(245, 156, 26, 0.5);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #3A2665;
}

.btn-lg {
  padding: 1.125rem 2.75rem;
  font-size: 1.125rem;
}

.btn-full {
  width: 100%;
}

/* ===== FILTRES AMÉLIORÉS ===== */
.filters-section {
  padding: 1.5rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #F8F9FA;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Mobile select dropdown */
.mobile-filter {
  display: none;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #3A2665;
  background: white;
  border: 2px solid #3A2665;
  border-radius: 12px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%233A2665' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
  transition: all 0.3s ease;
}

.mobile-filter:hover {
  background-color: #F8F9FA;
}

.mobile-filter:focus {
  outline: none;
  border-color: #1E183A;
  box-shadow: 0 0 0 3px rgba(58, 38, 101, 0.1);
}

/* Desktop filters avec scroll horizontal */
.filters-desktop {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filters-scroll {
  flex: 1;
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 0;
}

.filters-scroll::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: #F8F9FA;
  color: #495057;
  border: 2px solid transparent;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  background: white;
  border-color: #3A2665;
  color: #3A2665;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 38, 101, 0.15);
}

.filter-chip.active {
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(58, 38, 101, 0.3);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.filter-chip:hover .badge {
  background: rgba(58, 38, 101, 0.1);
}

.filter-chip.active .badge {
  background: rgba(255, 255, 255, 0.25);
}

.scroll-arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #E9ECEF;
  border-radius: 50%;
  color: #3A2665;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.scroll-arrow:hover {
  border-color: #3A2665;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(58, 38, 101, 0.15);
}

.scroll-arrow:active {
  transform: scale(0.95);
}

/* ===== WORKS SECTION ===== */
.works-section {
  padding: 3rem 0 5rem;
  background: #F8F9FA;
}

.works-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #E9ECEF;
}

.works-title {
  font-size: 2rem;
  color: #1E183A;
  margin: 0;
  font-weight: 700;
}

.works-count {
  font-size: 1rem;
  color: #6C757D;
  margin: 0;
  font-weight: 500;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading, .error, .empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #6C757D;
  font-size: 1.125rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E9ECEF;
  border-top-color: #3A2665;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty svg {
  margin: 0 auto 1rem;
  opacity: 0.3;
}

/* ===== PAGINATION AMÉLIORÉE ===== */
.pagination-info {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #E9ECEF;
}

.pagination-info p {
  margin: 0;
  color: #6C757D;
  font-size: 0.95rem;
}

.pagination-info strong {
  color: #3A2665;
  font-weight: 700;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #E9ECEF;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 44px;
  height: 44px;
  padding: 0 1rem;
  background: white;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #3A2665;
  color: #3A2665;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 38, 101, 0.15);
}

.page-btn:active:not(:disabled) {
  transform: translateY(0);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.page-btn.active {
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(58, 38, 101, 0.3);
  transform: scale(1.05);
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-num {
  min-width: 44px;
}

.ellipsis {
  padding: 0 0.5rem;
  color: #ADB5BD;
  font-weight: 600;
  user-select: none;
}

.prev, .next {
  font-weight: 600;
}

.prev svg {
  margin-right: 0.25rem;
}

.next svg {
  margin-left: 0.25rem;
}

/* ===== CONTACT SECTION ===== */
.contact-section {
  padding: 6rem 0;
  background: white;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-info h2 {
  font-size: 2.5rem;
  color: #1E183A;
  margin-bottom: 1rem;
}

.contact-description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #6C757D;
  margin-bottom: 2.5rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.05) 0%, rgba(237, 0, 226, 0.05) 100%);
  transform: translateX(8px);
}

.method-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3A2665 0%, #1E183A 100%);
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
}

.method-content h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1E183A;
  margin: 0 0 0.25rem 0;
}

.method-content p {
  font-size: 0.95rem;
  color: #6C757D;
  margin: 0;
}

/* Formulaire de contact */
.contact-form-container {
  background: linear-gradient(135deg, rgba(58, 38, 101, 0.03) 0%, rgba(237, 0, 226, 0.03) 100%);
  padding: 2.5rem;
  border-radius: 20px;
  border: 2px solid rgba(58, 38, 101, 0.1);
}

.contact-form h3 {
  font-size: 1.75rem;
  color: #1E183A;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3A2665;
  box-shadow: 0 0 0 3px rgba(58, 38, 101, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.form-message.success {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.form-message.error {
  background: rgba(220, 53, 69, 0.1);
  color: #DC3545;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

/* ===== FOOTER ===== */
.footer {
  background: linear-gradient(135deg, #1E183A 0%, #3A2665 100%);
  color: white;
  padding: 4rem 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand h2 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.footer-logo {
  margin: 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #F59C1A;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 0.75rem;
}

.footer-column a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #F59C1A;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #F59C1A;
  transform: translateY(-4px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.footer-credit a {
  color: #F59C1A;
  text-decoration: none;
  font-weight: 600;
}

.footer-credit a:hover {
  text-decoration: underline;
}

/* ===== ANIMATIONS ===== */
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

.slide-up {
  animation: slideUp 0.8s ease-out;
}

.scale-in {
  animation: scaleIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-links {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 70vh;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
  }

  /* Afficher mobile filter, masquer desktop */
  .mobile-filter {
    display: block;
  }

  .filters-desktop {
    display: none;
  }

  .works-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .works-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Pagination responsive */
  .page-btn span {
    display: none;
  }

  .page-btn {
    min-width: 40px;
    height: 40px;
    padding: 0;
  }

  .prev, .next {
    width: 40px;
  }

  .pagination {
    gap: 0.35rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .works-title {
    font-size: 1.5rem;
  }

  .page-num {
    min-width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .prev, .next {
    width: 36px;
    height: 36px;
  }

  .prev svg, .next svg {
    width: 16px;
    height: 16px;
  }
}

</style>