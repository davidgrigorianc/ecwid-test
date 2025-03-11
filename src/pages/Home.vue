<template>
  <v-container>
    <v-row
      v-if="!isLoadingCategories"
      class="justify-center"
    >
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="12"
        lg="4"
        md="6"
        sm="6"
        xs="12"
      >
        <CategoryCard :category="category" />
      </v-col>
    </v-row>
    <v-row v-if="!isLoadingProducts">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        md="4"
        sm="6"
        xs="12"
      >
        <ProductCard
          :product="product"
        />
      </v-col>
    </v-row>
    <v-row v-if="isLoadingCategories || isLoadingProducts">
      <v-col
        cols="12"
        class="text-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent, onMounted, computed} from 'vue';
import { useProductsStore } from '@/store/products';
import CategoryCard from '@/components/CategoryCard.vue';
import ProductCard from '@/components/ProductCard.vue';

export default defineComponent({
  components: { CategoryCard, ProductCard },
  setup() {
    const productsStore = useProductsStore();

    const categories = computed(() => productsStore.categories);
    const products = computed(() => productsStore.products);
    const isLoadingCategories = computed(() => productsStore.isLoadingCategories);
    const isLoadingProducts = computed(() => productsStore.isLoadingProducts);

    const fetchData = async () => {
      try {
        await Promise.all([productsStore.fetchCategories(), productsStore.fetchProducts()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(fetchData);

    return {
      categories,
      products,
      isLoadingCategories,
      isLoadingProducts,
    };
  },
});
</script>
