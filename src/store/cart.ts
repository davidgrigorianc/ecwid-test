import { defineStore } from 'pinia';
import type { Product } from '@/types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(sessionStorage.getItem('cart') || '[]') as Array<{
      product: Product;
      size: string | null;
      quantity: number;
    }>
  }),

  getters: {
    getCartItems(state) {
      return state.cart;
    },
  },

  actions: {
    saveCart() {
      sessionStorage.setItem('cart', JSON.stringify(this.cart));
    },

    addToCart(product: Product, size: string | null, quantity: number = 1) {
      const existingProduct = this.cart.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        this.cart.push({ product, size, quantity });
      }
      this.saveCart();
    },

    removeFromCart(productId: number, size: string | null) {
      this.cart = this.cart.filter(
        (item) => !(item.product.id === productId && item.size === size)
      );
      this.saveCart();
    },

    updateQuantity(productId: number, size: string | null, quantity: number) {
      const product = this.cart.find(
        (item) => item.product.id === productId && item.size === size
      );
      if (product) {
        product.quantity = quantity;
        this.saveCart();
      }
    },

    clearCart(){
      this.cart = []
      this.saveCart();
    }
  },
});
