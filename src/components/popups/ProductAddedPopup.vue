<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="cart-slide-popup"
    >
      <div class="popup-content">
        <img
          v-if="product.media?.images && product.media.images.length > 0"
          :src="product.media.images[0].image400pxUrl"
          alt="Product image"
          class="product-image"
        >
        <p class="product-name">
          {{ product.name }}
        </p>
        <p class="product-price">
          {{ formattedPrice }}
        </p>
        <p
          v-if="selectedSize"
          class="product-size"
        >
          Size: {{ selectedSize }}
        </p>
        <v-btn
          color="primary"
          @click="goToCart"
        >
          Go to Cart
        </v-btn>
        <v-btn
          color="secondary"
          @click="closePopup"
        >
          Continue Shopping
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {defineComponent, computed, type PropType} from 'vue';
import type { Product} from '@/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    visible: Boolean,
    selectedSize: {
      type: String,
      required: false,
      default: null
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const router = useRouter()
    const closePopup = () => {
      emit('update:visible', false);
    };

    const goToCart = (): void => {
      router.push('/cart');
    };

    const formattedPrice = computed(() => {
      return `$${props.product.defaultDisplayedPriceFormatted}`;
    });

    return {
      closePopup,
      goToCart,
      formattedPrice
    };
  }
});
</script>

<style scoped>
.cart-slide-popup {
  position: fixed;
  top: 100px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  width: 320px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  max-width: 150px;
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  font-size: 16px;
  color: #28a745;
  margin-bottom: 10px;
}

.product-size {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.cart-slide-popup .v-btn {
  width: 100%;
  margin-top: 10px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
