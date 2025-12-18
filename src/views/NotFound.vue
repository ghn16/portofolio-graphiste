<template>
  <div class="not-found">
    <div class="container">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <router-link to="/" class="btn-home">
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #333;
}

p {
  font-size: 1.5rem;
  color: #666;
  margin: 1rem 0 2rem;
}

.btn-home {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.btn-home:hover {
  background: #555;
}
</style>