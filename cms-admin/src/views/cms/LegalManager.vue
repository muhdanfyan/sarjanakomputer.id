<script setup lang="ts">
import { ref, onMounted } from 'vue';

const files = ref<any[]>([]);
const selectedFile = ref<any>(null);
const fileContent = ref<string>('');
const isSaving = ref(false);
const isLoading = ref(false);

const fetchFiles = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('/api/content?path=src/content/legal');
    if (res.ok) {
      files.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching files:', error);
  } finally {
    isLoading.value = false;
  }
};

const openFile = async (file: any) => {
  selectedFile.value = file;
  isLoading.value = true;
  try {
    const res = await fetch(`/api/content?path=${file.path}`);
    if (res.ok) {
      const data = await res.json();
      fileContent.value = data.decoded_content;
    }
  } catch (error) {
    console.error('Error fetching content:', error);
  } finally {
    isLoading.value = false;
  }
};

const saveFile = async () => {
  if (!selectedFile.value) return;
  isSaving.value = true;
  try {
    const res = await fetch('/api/github/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: selectedFile.value.path,
        content: fileContent.value,
        message: `CMS Update: ${selectedFile.value.name}`
      })
    });
    if (res.ok) {
      alert('Berhasil disimpan ke GitHub!');
    } else {
      alert('Gagal menyimpan.');
    }
  } catch (error) {
    console.error('Error saving:', error);
  } finally {
    isSaving.value = false;
  }
};

const closeEditor = () => {
  selectedFile.value = null;
  fileContent.value = '';
};

onMounted(fetchFiles);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4" v-if="!selectedFile">
      <v-card variant="flat" class="border">
        <v-card-title>
          Legalitas
          <v-spacer></v-spacer>
          <v-btn icon size="small" @click="fetchFiles" :loading="isLoading"><v-icon>mdi-refresh</v-icon></v-btn>
        </v-card-title>
        <v-list>
          <v-list-item 
            v-for="file in files" 
            :key="file.sha" 
            @click="openFile(file)"
            :title="file.name"
            prepend-icon="mdi-file-document-outline"
          >
          </v-list-item>
          <v-list-item v-if="files.length === 0 && !isLoading">
            Belum ada file.
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col cols="12" md="8" v-if="selectedFile">
      <v-card variant="flat" class="border">
        <v-card-title>
          <v-btn icon size="small" variant="text" @click="closeEditor"><v-icon>mdi-arrow-left</v-icon></v-btn>
          Edit: {{ selectedFile.name }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveFile" :loading="isSaving">Simpan ke GitHub</v-btn>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="fileContent"
            variant="outlined"
            auto-grow
            rows="15"
            label="Isi Konten (Markdown + YAML Frontmatter)"
            class="font-monospace"
            style="font-family: monospace;"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
