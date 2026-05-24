import {
  DashboardIcon,
  HomeIcon,
  UserIcon,
  NewsIcon,
  UsersIcon,
  FileTextIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'CMS Dashboard' },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    to: '/dashboard'
  },
  { divider: true },
  { header: 'Manajemen Konten' },
  {
    title: 'Halaman Utama',
    icon: HomeIcon,
    to: '/cms/home'
  },
  {
    title: 'Profil Perusahaan',
    icon: UserIcon,
    to: '/cms/profile'
  },
  {
    title: 'Portal Berita',
    icon: NewsIcon,
    to: '/cms/news'
  },
  {
    title: 'Tim & Staf',
    icon: UsersIcon,
    to: '/cms/team'
  },
  {
    title: 'Legalitas',
    icon: FileTextIcon,
    to: '/cms/legal'
  }
];

export default sidebarItem;
