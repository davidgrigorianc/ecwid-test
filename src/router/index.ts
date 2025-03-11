import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home.vue';
import CategoryPage from '@/pages/Category.vue';
import ProductPage from '@/pages/Product.vue';
import CartPage from '@/pages/Cart.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/category/:slug/:id',
    name: 'CategoryPage',
    component: CategoryPage
  },
  {
    path: '/category/:category_slug/:category_id/product/:slug/:id',
    name: 'ProductPageWithCategory',
    component: ProductPage,
  },
  {
    path: '/product/:slug/:id',
    name: 'ProductPage',
    component: ProductPage,
  },
  { path: '/cart', component: CartPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
