//Larsen u25004141
<script setup>

</script>

<template>
  <div id="app">
    <nav>
      <h1>Schedule Transformer</h1>
      <router-link to="/">Upload Files</router-link>
      <router-link to="/transform">Transform XML</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
nav { 
  padding: 20px; 
  background: #dedddd; 
  border-bottom: 1px solid #ccc; 
  position: sticky; 
  top: 0; 
  z-index: 1000;
  width: 100%;
  box-sizing: border-box; 
}

nav h1 {
  font-weight: bolder;
  color : #333;
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