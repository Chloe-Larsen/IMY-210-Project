<script setup>
import { ref, onMounted } from 'vue';

const xmlFiles = ref([]);
const xsltFiles = ref([]);
const selectedXml = ref('');
const selectedXslt = ref('');
const htmlOutput = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/files');
    const data = await res.json();
    xmlFiles.value = data.files.filter(f => f.endsWith('.xml'));
    xsltFiles.value = data.files.filter(f => f.endsWith('.xsl') || f.endsWith('.xslt'));
  } catch (err) {
    errorMsg.value = "Failed to load files from server.";
  }
});

const transformData = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  htmlOutput.value = '';
  
  try {
    const url = `http://localhost:3000/transform?xml=${selectedXml.value}&xslt=${selectedXslt.value}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }
    
    htmlOutput.value = await response.text();
  } catch (err) {
    errorMsg.value = "Transformation Error: " + err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
    <div class="transform-view">
        <h2>Transform Data</h2>
        <div class="controls">
            <label>
                Select XML Data:
                <select v-model="selectedXml">
                    <option v-for="file in xmlFiles" :key="file" :value="file">{{ file }}</option>
                </select>
            </label>
    
            <label>
                Select XSLT Template:
                <select v-model="selectedXslt">
                    <option v-for="file in xsltFiles" :key="file" :value="file">{{ file }}</option>
                </select>
            </label>
            <button @click="transformData" :disabled="!selectedXml || !selectedXslt || isLoading">
                Transform
            </button>
        </div>
        <p v-if="isLoading">Processing transformation...</p>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <div v-if="htmlOutput" class="output-container">
            <h3>Result:</h3>
            <iframe :srcdoc="htmlOutput" class="result-frame"></iframe>
        </div>
    </div>
</template>

<style scoped>

</style>
