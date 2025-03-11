<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        :md="cart.length ? '8' : '12'"
      >
        <h2 class="cart-title">
          Shopping Cart
        </h2>
        <v-divider class="my-4" />

        <v-row>
          <v-col
            v-for="(item, index) in paginatedCart"
            :key="index"
            cols="12"
          >
            <v-card class="cart-item">
              <v-row align="center">
                <v-col cols="3">
                  <v-img
                    :src="item.product.imageUrl"
                    class="cart-item-image"
                    alt="Product image"
                  />
                </v-col>
                <v-col cols="5">
                  <div class="cart-item-details">
                    <h3 class="cart-item-name">
                      {{ item.product.name }}
                    </h3>
                    <p
                      v-if="item.size"
                      class="cart-item-size"
                    >
                      Size: <strong>{{ item.size }}</strong>
                    </p>
                    <p class="cart-item-price">
                      Price: <strong>€ {{ item.product.price.toFixed(2) }}</strong>
                    </p>
                  </div>
                </v-col>
                <v-col
                  cols="4"
                  class="cart-actions"
                >
                  <div class="quantity-controls">
                    <v-btn
                      variant="outlined"
                      icon="mdi-minus"
                      :disabled="item.quantity <= 1"
                      @click="updateQuantity(item.product.id, item.size, item.quantity - 1)"
                    />
                    <span class="quantity">{{ item.quantity }}</span>
                    <v-btn
                      variant="outlined"
                      icon="mdi-plus"
                      @click="updateQuantity(item.product.id, item.size, item.quantity + 1)"
                    />
                  </div>
                  <p class="cart-total">
                    Total: <strong>€ {{ (item.product.price * item.quantity).toFixed(2) }}</strong>
                  </p>
                  <v-btn
                    color="red"
                    variant="outlined"
                    @click="removeFromCart(item.product.id, item.size)"
                  >
                    Remove
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-pagination
          v-if="cart.length > itemsPerPage"
          v-model="currentPage"
          :length="totalPages"
          class="mt-4"
        />
      </v-col>

      <v-col
        v-if="cart.length"
        cols="12"
        md="4"
      >
        <v-card class="cart-summary">
          <v-card-title class="cart-summary-title">
            Order Summary
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="summary-item">
              <span>Total:</span>
              <span><strong>€ {{ cartTotal.toFixed(2) }}</strong></span>
            </div>
            <v-btn
              color="teal-lighten-1"
              block
              class="checkout-btn"
              @click="placeOrder"
            >
              Place order
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="cart.length === 0">
      <v-col
        cols="12"
      >
        <h3 class="empty-cart-text">
          Your cart is empty.
        </h3>
        <v-btn
          rounded="md"
          color="teal-lighten-1"
          class="mt-2"
          @click="goHome"
        >
          Continue Shopping
        </v-btn>
      </v-col>
    </v-row>
    <OrderConfirmationPopup
      v-if="order"
      :visible="orderConfirmed"
      :order="order"
      @update:visible="orderConfirmed = $event"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useCartStore } from '@/store/cart';
import router from "@/router";
import OrderConfirmationPopup from "@/components/popups/OrderConfirmationPopup.vue";

export default defineComponent({
  components: {OrderConfirmationPopup},
  setup() {
    const cartStore = useCartStore();
    const cart = computed(() => cartStore.getCartItems);
    const order = computed(() => cartStore.getOrder);
    const orderConfirmed = ref(false)

    const itemsPerPage = 4;
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(cart.value.length / itemsPerPage));

    const paginatedCart = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return cart.value.slice(start, start + itemsPerPage);
    });

    const cartTotal = computed(() =>
      cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    );

    const updateQuantity = (productId: number, size: string | null, quantity: number) => {
      if (quantity <= 0) return;
      cartStore.updateQuantity(productId, size, quantity);
    };

    const removeFromCart = (productId: number, size: string | null) => {
      cartStore.removeFromCart(productId, size);
    };

    const placeOrder = () => {
      cartStore.createOrder();
      orderConfirmed.value = true
    };

    const goHome = (): void => {
      router.push('/');
    };

    return {
      updateQuantity,
      removeFromCart,
      placeOrder,
      goHome,
      cart,
      cartTotal,
      paginatedCart,
      currentPage,
      totalPages,
      itemsPerPage,
      order,
      orderConfirmed
    };
  },
});
</script>

<style scoped>
.cart-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.cart-item {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.cart-item:hover {
  transform: scale(1.02);
}

.cart-item-image {
  width: 100%;
  max-width: 100px;
  height: auto;
  border-radius: 8px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.cart-item-size,
.cart-item-price {
  font-size: 1rem;
  color: #555;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.cart-total {
  font-size: 1rem;
  font-weight: bold;
}

.cart-summary {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.cart-summary-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.checkout-btn {
  margin-top: 10px;
  font-size: 1.1rem;
  padding: 12px 24px;
}

.empty-cart-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: #777;
}
</style>
