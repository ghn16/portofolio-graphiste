<script setup>
const handleSubmit = () => {
  alert('Message envoyé ! Naomie reviendra vers vous bientôt.')
}
</script>

<template>
  <section id="contact" class="py-24 px-6">
    <div class="max-w-4xl mx-auto glass-card p-12 rounded-3xl">

      <div class="text-center mb-12">
        <h2 class="text-brand-yellow font-display text-4xl mb-4">
          Discutons de votre projet
        </h2>
        <p class="text-gray-400">
          Prête à donner vie à vos ambitions visuelles.
        </p>
      </div>

      <form
        class="grid md:grid-cols-2 gap-6"
        @submit.prevent="handleSubmit"
      >

        <!-- Nom -->
        <div class="flex flex-col space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500">
            Nom
          </label>
          <input
            type="text"
            placeholder="Votre nom"
            class="bg-brand-purple-dark/50 border border-brand-purple-main p-4 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
          >
        </div>

        <!-- Email -->
        <div class="flex flex-col space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500">
            Email
          </label>
          <input
            type="email"
            placeholder="votre@email.com"
            class="bg-brand-purple-dark/50 border border-brand-purple-main p-4 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
          >
        </div>

        <!-- Message -->
        <div class="flex flex-col space-y-2 md:col-span-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-500">
            Votre vision
          </label>
          <textarea
            rows="4"
            placeholder="Décrivez votre besoin créatif..."
            class="bg-brand-purple-dark/50 border border-brand-purple-main p-4 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
          ></textarea>
        </div>

        <!-- Bouton -->
        <button
          type="submit"
          class="md:col-span-2 py-5 bg-brand-purple-vibrant text-white font-bold rounded-xl hover:bg-brand-yellow hover:text-brand-purple-dark transition-all duration-300 uppercase tracking-widest"
        >
          Lancer la collaboration
        </button>

      </form>

    </div>
  </section>
</template>
