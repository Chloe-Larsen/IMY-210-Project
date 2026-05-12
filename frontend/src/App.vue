<script setup>

</script>

<template>
  <div id="app">
    <nav>
      <h1>Schedule Transformer</h1>
      <router-link to="/">Upload Files</router-link>
      <router-link to="/transform">Transform & vue</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
nav { 
  padding: 20px; 
  background: #f4f4f4; 
  border-bottom: 1px solid #ccc; 
}

nav a { 
  margin: 0 10px; 
  text-decoration: none; 
  color: #333; 
  font-weight: bold; 
}

nav a.router-link-exact-active { 
  color: #42b983; 
}

main { 
  padding: 20px; 
}
</style>