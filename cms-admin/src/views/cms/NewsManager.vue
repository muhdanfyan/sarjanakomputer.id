<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { uploadToCloudinary } from '@/utils/cloudinary';

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls = await uploadToCloudinary(files);
  callback(urls);
};

const files = ref<any[]>([]);
const selectedFile = ref<any>(null);
const fileContent = ref<string>('');
const isSaving = ref(false);
const isLoading = ref(false);

const extractFrontmatter = (md: string) => {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const lines = match[1].split('\n');
  const result: Record<string, string> = {};
  lines.forEach(line => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      result[key] = val;
    }
  });
  return result;
};

const fetchFiles = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('/api/content?path=src/content/news');
    if (res.ok) {
      const data = await res.json();
      files.value = data.map((f: any) => ({ ...f, meta: null }));
      
      // Async fetch frontmatter for each file to display on cards
      files.value.forEach(async (f) => {
        try {
          const mRes = await fetch(`/api/content?path=${f.path}`);
          if (mRes.ok) {
            const mData = await mRes.json();
            f.meta = extractFrontmatter(mData.decoded_content);
          }
        } catch (e) {}
      });
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
      // Update local meta just in case title/image changed
      selectedFile.value.meta = extractFrontmatter(fileContent.value);
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
  <div>
    <!-- List View -->
    <div v-if="!selectedFile">
      <div class="d-flex align-center mb-6">
        <h2 class="text-h3 font-weight-bold">Daftar Berita</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-plus" class="mr-2" disabled>Berita Baru</v-btn>
        <v-btn icon size="small" @click="fetchFiles" :loading="isLoading"><v-icon>mdi-refresh</v-icon></v-btn>
      </div>

      <div v-if="isLoading && files.length === 0" class="text-center py-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <v-row v-else>
        <v-col cols="12" md="4" sm="6" v-for="file in files" :key="file.sha">
          <v-card hover @click="openFile(file)" class="h-100 d-flex flex-column rounded-xl border elevation-0" style="transition: all 0.3s ease;">
            <v-img :src="file.meta?.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'" height="200" cover class="bg-grey-lighten-2">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
                </div>
              </template>
            </v-img>
            
            <v-card-item class="pt-4">
              <div class="d-flex align-center mb-2">
                <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">{{ file.meta?.category || 'News' }}</v-chip>
                <span class="text-caption text-grey ml-3">{{ file.meta?.date || file.name }}</span>
              </div>
              <v-card-title class="text-h5 font-weight-bold text-wrap" style="line-height: 1.3;">{{ file.meta?.title || file.name.replace('.md', '') }}</v-card-title>
            </v-card-item>
            
            <v-card-text class="text-body-1 text-grey-darken-1 mb-auto">
              {{ file.meta?.description || 'Tidak ada deskripsi. Klik untuk membaca dan mengedit artikel ini secara penuh di dalam editor Markdown WYSIWYG.' }}
            </v-card-text>
            
            <v-divider></v-divider>
            <v-card-actions class="pa-4 bg-grey-lighten-4">
              <v-btn color="primary" variant="flat" block prepend-icon="mdi-pencil">Edit Berita</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" v-if="files.length === 0 && !isLoading">
          <v-alert type="info" variant="tonal">Belum ada berita ditemukan.</v-alert>
        </v-col>
      </v-row>
    </div>

    <!-- Editor View -->
    <v-row v-if="selectedFile">
      <v-col cols="12" md="12">
        <v-card variant="flat" class="border rounded-xl overflow-hidden">
          <v-toolbar color="white" border>
            <v-btn icon @click="closeEditor"><v-icon>mdi-arrow-left</v-icon></v-btn>
            <v-toolbar-title class="font-weight-bold">Edit: {{ selectedFile.meta?.title || selectedFile.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="flat" @click="saveFile" :loading="isSaving" prepend-icon="mdi-content-save">Simpan ke GitHub</v-btn>
          </v-toolbar>
          <v-card-text class="pa-0">
            <MdEditor v-model="fileContent" language="en-US" style="height: 75vh;" @onUploadImg="onUploadImg" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
