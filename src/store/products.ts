import { defineStore } from 'pinia';
import { fetchCategories, fetchCategory, fetchProducts, fetchProduct } from '@/api';
import type { Category, Product } from '@/types';

export const useProductsStore = defineStore('products', {
  state: () => ({
    categories: [] as Category[],
    products: [] as Product[],
    currentCategory: null as Category | null,
    currentProduct: null as Product | null,
    loading_products: false,
    loading_categories: false,
    loading_product: false,
    loading_category: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories() {
      this.loading_categories = true;
      this.error = null;

      try {
        this.categories = await fetchCategories();
      } catch (error) {
        console.log(error)
        this.error = 'Failed to fetch categories';
      } finally {
        this.loading_categories = false;
      }
    },

    async fetchProducts(productIds?: number[]) {
      this.loading_products = true;
      this.error = null;

      try {
        if (productIds && productIds.length > 0) {
          this.products = await fetchProducts({productIds});
        } else {
          this.products = await fetchProducts();
        }
      } catch (error) {
        console.log(error)
        this.error = 'Failed to fetch products';
      } finally {
        this.loading_products = false;
      }
    },

    async fetchProduct(productId: number) {
      this.loading_product = true;
      this.error = null;

      try {
        const product = await fetchProduct(productId);
        if (product) {
          this.currentProduct = product;
        } else {
          this.error = 'Product not found';
        }
      } catch (error) {
        console.log(error)
        this.error = 'Failed to fetch product';
      } finally {
        this.loading_product = false;
      }
    },

    async fetchCategoryAndProducts(categoryId: number) {
      this.loading_categories = true;
      this.loading_products = true;
      this.error = null;

      try {
        let category = this.categories.find((cat) => cat.id === categoryId) || null;

        if (!(category && category.productIds)) {
          category = await fetchCategory(categoryId);
          if (!category) {
            this.error = 'Category not found';
            return;
          }
        }

        this.currentCategory = category;

        if (category.productIds?.length) {
          await this.fetchProducts(category.productIds);
        } else {
          this.products = [];
        }
      } catch (error) {
        console.log(error)
        this.error = 'Failed to fetch category or products';
      } finally {
        this.loading_categories = false;
        this.loading_products = false;
      }
    },
  },

  getters: {
    getCategories: (state) => state.categories,
    getProducts: (state) => state.products,
    getCurrentCategory: (state) => state.currentCategory,
    getCurrentProduct: (state) => state.currentProduct,
    isLoadingCategories: (state) => state.loading_categories,
    isLoadingProducts: (state) => state.loading_products,
    isLoadingProduct: (state) => state.loading_product,
    isLoadingCategory: (state) => state.loading_category,
    getError: (state) => state.error,
  },
});
