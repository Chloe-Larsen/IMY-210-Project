<script setup>
import { ref , onMounted} from 'vue';

const xmlFile = ref(null);
const generalFile = ref(null);
const message = ref('');
const isError = ref(false);
const isLoading = ref(false);
const isXsdUploaded = ref(false);
const filesList = ref([]);
const xmlInputRef = ref(null);
const fileInputRef = ref(null);
let messageTimeout = null;

const displayMessage = (msg, errorState = false) => {
  message.value = msg;
  isError.value = errorState;  
  if (messageTimeout) clearTimeout(messageTimeout);  
  if (!errorState) {
    messageTimeout = setTimeout(() => {
      message.value = '';
    }, 5000);
  }
};

const fetchFiles = async () => {
  try {
    const res = await fetch('http://localhost:3000/files');
    const data = await res.json();
    filesList.value = data.files;      
    isXsdUploaded.value = data.files.includes('schedule.xsd');
  } catch (err) {
    console.warn("Could not fetch existing files.");
  }
};

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/files');
    const data = await res.json();
    if (data.files.includes('schedule.xsd')) {
      isXsdUploaded.value = true;
    }
    fetchFiles();
  } catch (err) {
    console.warn("Could not fetch existing files.");
  }
});

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
  const isXsd = generalFile.value.name.endsWith('.xsd');
  const formData = new FormData();
  formData.append('file', generalFile.value);
  await executeUpload('http://localhost:3000/upload/file', formData, isXsd);
};

const executeUpload = async (url, formData, isXsd = false) => {
  isLoading.value = true;
  message.value = '';
  try {
    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    displayMessage("Success: " + (data.message || "File uploaded"), false);
    isError.value = false;
    if (isXsd) {
      isXsdUploaded.value = true;
    }
    await fetchFiles();
  } catch (error) {
    displayMessage("Error: " + error.message, true);
    isError.value = true;
  } finally {
    isLoading.value = false;
    if (xmlInputRef.value) xmlInputRef.value.value = '';
    if (fileInputRef.value) fileInputRef.value.value = '';
    xmlFile.value = null;
    generalFile.value = null;
  }
};

const deleteFile = async (filename) => {  
  if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

  isLoading.value = true;
  message.value = '';
  
  try {
    const response = await fetch(`http://localhost:3000/files/${filename}`, {
      method: 'DELETE'
    });
    const data = await response.json();    
    if (!response.ok) throw new Error(data.message || 'Delete failed');        
    displayMessage(`Success: ${filename} was deleted.`, false);
    isError.value = false;      
    await fetchFiles();
    
  } catch (error) {
    displayMessage("Error: " + error.message, true);
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
        <input type="file" @change="handleFileChange($event, 'file')" ref="fileInputRef"/>
        <button @click="uploadFile" :disabled="isLoading">Upload File</button>
    </div>

    <div class="upload-section" v-if="isXsdUploaded">
        <h3>Upload XML (with XSD validation)</h3>
        <input type="file" @change="handleFileChange($event, 'xml')" accept=".xml" ref="xmlInputRef"/>
        <button @click="uploadXml" :disabled="isLoading">Upload XML</button>
    </div>

    <div class="upload-section" v-else>
      <h3>Upload XML</h3>
      <p style="color: #666; font-style: italic;">
        Upload your XSD schema file first to unlock XML uploading.
      </p>
    </div>

    <div class="upload-section file-list-section">
      <h3>Manage Uploaded Files</h3>
      <p v-if="filesList.length === 0" class="empty-msg">No files uploaded yet.</p>
      
      <ul class="file-list" v-else>
        <li v-for="file in filesList" :key="file">
          <span class="filename">{{ file }}</span>
          <button @click="deleteFile(file)" :disabled="isLoading" class="delete-btn">
            Delete
          </button>
        </li>
      </ul>
    </div>

    <p v-if="message" :class="{'error': isError, 'success': !isError}">{{ message }}</p>
    <p v-if="isLoading">Loading...</p>
  </div>
</template>

<style scoped>
h2 {
  font-weight: bolder;
  text-align: center;  
  margin-bottom: 10px;
}

.upload-section { 
    margin-bottom: 20px; 
    padding: 20px; 
    border: 1px solid #e0e0e0; 
    border-radius: 8px;
    background-color: #f9f9f9;
}

h3 {
  font-weight: bold;
  margin-top: 0;
  color: #333;
}

button {
  padding: 8px 16px;
  background-color: #42b983; /* Vue Green */
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

button:disabled {
  background-color: #a0d8bf;
  cursor: not-allowed;
  opacity: 0.8;
}

input[type="file"] {
  font-family: inherit;
  font-size: 14px;
  color: #555;
  margin-right: 15px;
  cursor: pointer;
}

input[type="file"]::file-selector-button {
  padding: 6px 14px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 10px;
}

input[type="file"]::file-selector-button:hover {
  background-color: #efefef;
}

.file-list-section {
  background-color: #ffffff;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #eee;
  background: #fafafa;
  margin-bottom: 8px;
  border-radius: 4px;
}

.filename {
  font-family: monospace;
  font-size: 14px;
  color: #444;
}

.delete-btn {
  background-color: #e74c3c;
  padding: 6px 12px;
  font-size: 13px;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.delete-btn:disabled {
  background-color: #f19a90;
}

.error { 
  color: #d32f2f; 
  font-weight: 500;
  text-align: center;
}

.success{
  text-align: center;
}

.empty-msg {
  color: #777;
  font-style: italic;
  margin: 0;
}
</style>
