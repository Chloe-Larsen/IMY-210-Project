//Larsen u25004141
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
    selectedXml.value = '';
    selectedXslt.value = '';
  } catch (err) {
    errorMsg.value = "Transformation Error: " + err.message;
  } finally {
    isLoading.value = false;
  }
};

const downloadPdf = async () => {
  isPdfLoading.value = true;
  errorMsg.value = '';
  htmlOutput.value = '';
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
    selectedXml.value = '';
    selectedXslt.value = '';
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
        
        <div class="control-panel">
            <div class="controls">
                <label>
                    Select XML Data:
                    <select v-model="selectedXml" class="custom-select">
                        <option disabled value="">-- Choose XML --</option>
                        <option v-for="file in xmlFiles" :key="file" :value="file">{{ file }}</option>
                    </select>
                </label>
        
                <label>
                    Select XSLT Template:
                    <select v-model="selectedXslt" class="custom-select">
                        <option disabled value="">-- Choose XSLT --</option>
                        <option v-for="file in xsltFiles" :key="file" :value="file">{{ file }}</option>
                    </select>
                </label>
                
                <div class="action-buttons">
                  <button @click="transformData" :disabled="!selectedXml || !selectedXslt || isLoading || isPdfLoading || !selectedXslt.includes('html') " class="view-btn">
                    View HTML
                  </button>
              
                  <button @click="downloadPdf" :disabled="!selectedXml || !selectedXslt || isLoading || isPdfLoading || !(selectedXslt.includes('pdf') || selectedXslt.includes('fo')) " class="pdf-btn">
                    {{ isPdfLoading ? 'Generating PDF...' : 'Download PDF' }}
                  </button>
                </div>
            </div>
        </div>

        <p v-if="isLoading" class="status-msg">Processing transformation...</p>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        
        <div v-if="htmlOutput" class="output-container">
            <h3>Transformation Result</h3>
            <iframe :srcdoc="htmlOutput" class="result-frame"></iframe>
        </div>
    </div>
</template>

<style scoped>
h2 {
  font-weight: bolder;
  text-align: center;  
  margin-bottom: 25px;    
}

h3 {
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.control-panel {
  background-color: #f9f9f9;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.controls { 
  display: flex; 
  gap: 25px; 
  align-items: flex-end; 
  flex-wrap: wrap; 
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: #444;
  font-size: 14px;
}

.custom-select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  min-width: 220px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}

.custom-select:hover {
  border-color: #aaa;
}

.action-buttons { 
  display: flex; 
  gap: 12px; 
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Primary Button (View HTML) */
.view-btn {
  background-color: #42b983;
  color: white;
}

.view-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.view-btn:disabled {
  background-color: #a0d8bf;
  cursor: not-allowed;
}

.pdf-btn { 
  background-color: #e74c3c; 
  color: white; 
}

.pdf-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.pdf-btn:disabled { 
  background-color: #f19a90; 
  cursor: not-allowed; 
}

.error { 
  color: #d32f2f; 
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
}

.status-msg {
  text-align: center;
  color: #555;
  font-style: italic;
}

.output-container {
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.result-frame { 
  width: 100%; 
  height: 650px; 
  border: 1px solid #ddd; 
  border-radius: 4px;
  background: white; 
}
</style>
