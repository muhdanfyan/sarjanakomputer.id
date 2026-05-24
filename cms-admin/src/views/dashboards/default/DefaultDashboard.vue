<script setup lang="ts">
import { ref } from 'vue';
import { HomeIcon, UserIcon, NewsIcon, UsersIcon, FileTextIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';

const router = useRouter();

const quickLinks = ref([
  { title: 'Kelola Halaman Utama', icon: HomeIcon, color: 'primary', to: '/cms/home', desc: 'Atur teks banner, layanan, dan section utama.' },
  { title: 'Kelola Profil', icon: UserIcon, color: 'secondary', to: '/cms/profile', desc: 'Perbarui sejarah, visi misi, dan profil perusahaan.' },
  { title: 'Kelola Berita', icon: NewsIcon, color: 'info', to: '/cms/news', desc: 'Tulis dan publikasikan artikel atau berita terbaru.' },
  { title: 'Kelola Tim', icon: UsersIcon, color: 'success', to: '/cms/team', desc: 'Perbarui daftar anggota tim dan staf.' },
  { title: 'Kelola Legalitas', icon: FileTextIcon, color: 'warning', to: '/cms/legal', desc: 'Atur dokumen Syarat Ketentuan & Privasi.' }
]);

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" class="bg-primary text-white mb-6">
        <v-card-text class="pa-8">
          <h2 class="text-h2 mb-2 text-white">Selamat Datang di CMS Sarjana Komputer Indonesia! 👋</h2>
          <p class="text-h5 font-weight-regular">
            Ini adalah pusat kendali untuk mengelola seluruh konten website utama Anda. 
            Setiap perubahan yang Anda simpan di sini akan langsung ter-update di website publik setelah proses sinkronisasi selesai.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <h3 class="text-h3 mb-4">Akses Cepat (Quick Links)</h3>
    </v-col>
    <v-col cols="12" md="4" sm="6" v-for="(link, i) in quickLinks" :key="i">
      <v-card elevation="0" class="border cursor-pointer hover-card" @click="navigateTo(link.to)">
        <v-card-text class="pa-5 d-flex align-center">
          <v-avatar :color="link.color" variant="tonal" rounded size="48" class="mr-4">
            <component :is="link.icon" stroke-width="1.5" size="24" />
          </v-avatar>
          <div>
            <h4 class="text-h4 mb-1">{{ link.title }}</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ link.desc }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.hover-card {
  transition: all 0.3s ease-in-out;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
