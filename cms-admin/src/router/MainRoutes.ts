const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      redirect: '/dashboard'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'HomeManager',
      path: '/cms/home',
      component: () => import('@/views/cms/HomeManager.vue')
    },
    {
      name: 'ProfileManager',
      path: '/cms/profile',
      component: () => import('@/views/cms/ProfileManager.vue')
    },
    {
      name: 'NewsManager',
      path: '/cms/news',
      component: () => import('@/views/cms/NewsManager.vue')
    },
    {
      name: 'TeamManager',
      path: '/cms/team',
      component: () => import('@/views/cms/TeamManager.vue')
    },
    {
      name: 'LegalManager',
      path: '/cms/legal',
      component: () => import('@/views/cms/LegalManager.vue')
    }
  ]
};

export default MainRoutes;
