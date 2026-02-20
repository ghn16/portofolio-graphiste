<script setup>
const phone = '22964827383' 
const message = encodeURIComponent('Bonjour Naomie, je souhaite discuter d\'un projet créatif avec vous.')
const whatsappUrl = `https://wa.me/${phone}?text=${message}`

const handleSubmit = () => alert('Message envoyé !')
</script>

<template>
  <section id="contact" class="py-16 md:py-24 px-4 md:px-6">
    <div class="max-w-4xl mx-auto">

      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-brand-yellow font-display text-2xl sm:text-3xl md:text-4xl mb-2 font-bold">
          Discutons de votre projet
        </h2>
        <p class="text-gray-400 text-sm md:text-base">Prête à donner vie à vos ambitions visuelles.</p>
      </div>

      <!-- CTA WhatsApp — couleurs du site -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-3 w-full py-4 md:py-5 rounded-2xl mb-6
               bg-brand-purple-vibrant hover:bg-brand-yellow text-white hover:text-brand-purple-dark
               font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.02]
               shadow-xl shadow-brand-purple-vibrant/30 hover:shadow-brand-yellow/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Contacter sur WhatsApp</span>
        <span class="text-sm font-normal opacity-80 hidden sm:inline">— Réponse rapide garantie !</span>
      </a>

      <!-- Séparateur -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1 h-px bg-brand-purple-main/40"></div>
        <span class="text-gray-500 text-xs uppercase tracking-widest">ou envoyer un message</span>
        <div class="flex-1 h-px bg-brand-purple-main/40"></div>
      </div>

      <!-- Formulaire -->
      <div class="glass-card p-5 sm:p-8 rounded-2xl">
        <form class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5" @submit.prevent="handleSubmit">
          <div class="flex flex-col space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Nom</label>
            <input type="text" placeholder="Votre nom"
              class="bg-brand-purple-dark/50 border border-brand-purple-main p-3 md:p-4 rounded-xl
                     focus:outline-none focus:border-brand-yellow transition-all text-sm">
          </div>
          <div class="flex flex-col space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
            <input type="email" placeholder="votre@email.com"
              class="bg-brand-purple-dark/50 border border-brand-purple-main p-3 md:p-4 rounded-xl
                     focus:outline-none focus:border-brand-yellow transition-all text-sm">
          </div>
          <div class="flex flex-col space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Votre vision</label>
            <textarea rows="4" placeholder="Décrivez votre besoin créatif..."
              class="bg-brand-purple-dark/50 border border-brand-purple-main p-3 md:p-4 rounded-xl
                     focus:outline-none focus:border-brand-yellow transition-all text-sm resize-none"></textarea>
          </div>
          <button type="submit"
            class="md:col-span-2 py-3.5 md:py-4 bg-brand-purple-main border border-brand-purple-vibrant
                   text-white font-bold rounded-xl hover:bg-brand-purple-vibrant
                   transition-all duration-300 uppercase tracking-widest text-xs md:text-sm">
            Envoyer le message
          </button>
        </form>
      </div>

    </div>
  </section>
</template>