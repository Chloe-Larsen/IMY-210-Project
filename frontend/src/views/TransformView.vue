<script setup>
import { ref, onMounted } from 'vue';

const xmlFiles = ref([]);
const xsltFiles = ref([]);
const selectedXml = ref('');
const selectedXslt = ref('');
const htmlOutput = ref('');
const isLoading = ref(false);
const isPdfLoading = ref(false);
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

const downloadPdf = async () => {
  isPdfLoading.value = true;
  errorMsg.value = '';

  try {    
    const url = `http://localhost:3000/generate-pdf?xml=${selectedXml.value}&xslt=${selectedXslt.value}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Server error while generating PDF");
    }
        
    const blob = await response.blob();    
    const downloadUrl = window.URL.createObjectURL(blob);    
    const link = document.createElement('a');
    link.href = downloadUrl;      
    link.download = selectedXml.value.replace('.xml', '.pdf');     
    document.body.appendChild(link);
    link.click();    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

  } catch (err) {
    errorMsg.value = "PDF Generation Error: " + err.message;
  } finally {
    isPdfLoading.value = false;
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
            <div class="action-buttons">
              <button @click="transformData" :disabled="!selectedXml || !selectedXslt || isLoading || isPdfLoading">
                View HTML
              </button>
          
              <button @click="downloadPdf" :disabled="!selectedXml || !selectedXslt || isLoading || isPdfLoading" class="pdf-btn">
                {{ isPdfLoading ? 'Generating PDF...' : 'Download PDF' }}
              </button>
      </div>
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
.controls { 
  display: flex; 
  gap: 20px; 
  align-items: flex-end; 
  margin-bottom: 20px; 
  flex-wrap: wrap; 
}
.action-buttons { 
  display: flex; 
  gap: 10px; 
}
.pdf-btn { 
  background-color: #d32f2f; 
  color: white; 
  border: 1px solid #b71c1c; 
  padding: 6px 12px; 
  cursor: pointer; 
  border-radius: 4px; 
}
.pdf-btn:disabled { 
  background-color: #ef9a9a; 
  border-color: #ef9a9a;
  cursor: not-allowed; 
}
.error { 
  color: red; 
}
.result-frame { 
  width: 100%; 
  height: 600px; 
  border: 1px solid #ccc; 
  background: white; 
}
</style>
