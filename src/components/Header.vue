<template>
  <v-app-bar app>
    <v-toolbar-title
      class="logo"
      @click="goHome"
    >
      Ecwid
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      icon
      @click="goToCart"
    >
      <v-icon size="x-large">
        mdi-cart
      </v-icon>
      <v-badge
        v-if="cartItemCount > 0"
        color="red"
        :content="cartItemCount"
      />
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart';

export default defineComponent({
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const goToCart = (): void => {
      router.push('/cart');
    };

    const goHome = (): void => {
      router.push('/');
    };

    const cartItemCount = computed(() => {
      return cartStore.getCartItems.reduce((total, item) => total + item.quantity, 0);
    });

    return { goToCart, goHome, cartItemCount };
  },
});
</script>

<style scoped>
.v-app-bar {
  background-color: #1976d2;
}
.logo{
  cursor: pointer;
}
</style>
