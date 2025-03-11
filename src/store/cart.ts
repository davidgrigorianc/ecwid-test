import { defineStore } from 'pinia';
import type { Product } from '@/types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(sessionStorage.getItem('cart') || '[]') as Array<{
      product: Product;
      size: string | null;
      quantity: number;
    }>,
    order: null as {
      orderNumber: string;
      orderDate: string;
      estimatedDeliveryDate: string;
      items: Array<{
        product: Product;
        quantity: number;
        size: string | null;
      }>;
      totalAmount: number;
    } | null,
  }),

  getters: {
    getCartItems(state) {
      return state.cart;
    },
    getOrder(state) {
      return state.order;
    },
    isOrderConfirmed(state) {
      return state.orderConfirmed;
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

    createOrder() {
      const orderNumber = `ORD${Math.floor(Math.random() * 100000000)}`;
      const orderDate = new Date().toISOString().split('T')[0];
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
      const totalAmount = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      this.order = {
        orderNumber,
        orderDate,
        estimatedDeliveryDate: estimatedDeliveryDate.toISOString().split('T')[0],
        items: this.cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
        })),
        totalAmount,
      };

      this.orderConfirmed = true;
      this.cart = [];
      this.saveCart();
    },
  },
});
