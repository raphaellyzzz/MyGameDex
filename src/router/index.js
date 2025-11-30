import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layout: 'AuthLayout' } 
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
    meta: { layout: 'AuthLayout' } 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true}
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router