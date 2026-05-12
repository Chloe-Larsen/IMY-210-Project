<script setup>
import { ref } from 'vue';

const xmlFile = ref(null);
const generateFile = ref(null);
const message = ref('');
const isError = ref(false);
const isLoading = ref(false);

const handleFileChange = (event, type) => {
  if (type === 'xml') xmlFile.value = event.target.files[0];
  if (type === 'file') generalFile.value = event.target.files[0];
};

const uploadXml = async () => {
  if (!xmlFile.value) return;
  const formData = new FormData();
  formData.append('xmlFile', xmlFile.value);
  await executeUpload('http://localhost:3000/upload/xml', formData);
};

const uploadFile = async () => {
  if (!generalFile.value) return;
  const formData = new FormData();
  formData.append('file', generalFile.value);
  await executeUpload('http://localhost:3000/upload/file', formData);
};

const executeUpload = async (url, formData) => {
  isLoading.value = true;
  message.value = '';
  try {
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    message.value = "Success: " + (data.message || "File uploaded");
    isError.value = false;
  } catch (error) {
    message.value = "Error: " + error.message;
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="upload-view">
    <h2>Upload Files</h2>
    <div class="upload-section">
        <h3>Upload XSLT/XSD</h3>
        <input type="file" @change="handleFileChange($event, 'file')"/>
        <button @click="uploadFile" :disabled="isLoading">Upload File</button>
    </div>

    <div class="upload-section">
        <h3>Upload XML (with XSD validation)</h3>
        <input type="file" @change="handleFileChange($event, 'xml')" accept=".xml" />
        <button @click="uploadXml" :disabled="isLoading">Upload XML</button>
    </div>

    <p v-if="message" :class="{'error': isError}">{{ message }}</p>
    <p v-if="isLoading">Loading...</p>
  </div>
</template>

<style scoped>
.upload-section { 
    margin-bottom: 20px; 
    padding: 15px; 
    border: 1px solid #ddd; 
}
.error { 
    color: red; 
}
</style>
