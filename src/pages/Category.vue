<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs>
          <v-breadcrumbs-item
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
          >
            <router-link
              v-if="breadcrumb.to"
              :to="breadcrumb.to"
              class="breadcrumb-link"
            >
              {{ breadcrumb.text }}
            </router-link>
            <span v-else>{{ breadcrumb.text }}</span>
            <span
              v-if="index < breadcrumbs.length - 1"
              class="ml-2"
            >/</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CategoryCard
          v-if="currentCategory"
          :category="currentCategory"
        />
      </v-col>

      <v-col
        v-if="isLoadingProducts"
        cols="12"
        class="loading-container"
      >
        <v-progress-circular
          indeterminate
          color="cyan"
          size="50"
        />
      </v-col>

      <v-col
        v-else-if="products.length > 0"
        cols="12"
      >
        <v-row>
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
              :category="currentCategory"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        v-else
        cols="12"
      >
        <p class="no-products">
          No products available.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/store/products';
import CategoryCard from '@/components/CategoryCard.vue';
import ProductCard from '@/components/ProductCard.vue';

export default defineComponent({
  components: { CategoryCard, ProductCard },

  setup() {
    const route = useRoute();
    const store = useProductsStore();

    const categoryId = computed(() => Number(route.params.id));

    onMounted(() => {
      fetchCategoryAndProducts(categoryId.value);
    });

    watch(categoryId, (newId) => {
      fetchCategoryAndProducts(newId);
    });

    const fetchCategoryAndProducts = async (id: number) => {
      await store.fetchCategoryAndProducts(id);
    };

    const breadcrumbs = computed(() => {
      const categorySlug = route.params.slug;
      return [
        { text: 'Home', to: '/' },
        { text: categorySlug , disabled: true},
      ];
    });

    const currentCategory = computed(() => store.currentCategory);
    const products = computed(() => store.products);
    const isLoadingProducts = computed(() => store.isLoadingProducts);

    return {
      categoryId,
      currentCategory,
      products,
      isLoadingProducts,
      breadcrumbs
    };
  }
});
</script>

<style scoped>
.no-products {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}
</style>
