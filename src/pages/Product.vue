<template>
  <v-container>
    <template v-if="product && !isLoadingProduct">
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
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            :src="selectedImageUrl || product?.imageUrl"
            alt="product image"
            class="product-image"
          />

          <div class="d-flex justify-center mt-2">
            <v-slide-group
              show-arrows
              class="thumbnail-slider"
            >
              <v-slide-group-item
                v-for="(image, index) in productImages"
                :key="index"
              >
                <v-card
                  class="mr-2"
                  width="80"
                  @click="selectImage(image.id)"
                >
                  <div
                    class="d-flex align-center justify-center thumbnail-container"
                    :class="{ 'selected-thumbnail': selectedImageId === image.id }"
                  >
                    <img
                      :src="image.image160pxUrl"
                      class="thumbnail"
                      alt="Product Image"
                    >
                  </div>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="product-details"
        >
          <div class="product-info">
            <h2>{{ product?.name }}</h2>
            <p class="price">
              {{ product?.defaultDisplayedPriceFormatted }}
            </p>
            <div
              class="description"
              v-html="sanitizedDescription"
            />

            <div
              v-for="(option, index) in product?.options"
              :key="index"
              class="product-option"
            >
              <div v-if="option.type === 'SIZE'">
                <div class="size-buttons">
                  <v-btn
                    v-for="(choice, idx) in option.choices"
                    :key="idx"
                    :class="{ 'selected-size': selectedSize === choice.text }"
                    :color="selectedSize === choice.text ? 'primary' : 'secondary'"
                    :variant="selectedSize === choice.text ? 'tonal' : 'outlined'"
                    class="size-button"
                    @click="selectSize(choice.text)"
                  >
                    {{ choice.text }}
                  </v-btn>
                </div>
              </div>
              <div v-else-if="option.type === 'COLOR'">
                <v-radio-group
                  v-model="selectedColor"
                  label="Select Color"
                >
                  <v-radio
                    v-for="(choice, idx) in option.choices"
                    :key="idx"
                    :label="choice.text"
                    :value="choice.text"
                  />
                </v-radio-group>
              </div>
            </div>

            <v-btn
              color="primary"
              :disabled="!canAddToCart"
              @click="addToCart"
            >
              Buy
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="isLoadingProduct">
      <v-row v-if="isLoadingProduct">
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
    </template>

    <ProductAddedPopup
      v-if="addToCartObject"
      v-model:visible="popupVisible"
      :product="addToCartObject.product"
      :selected-size="addToCartObject.size"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/store/products';
import { useCartStore } from '@/store/cart';
import DOMPurify from 'dompurify';
import ProductAddedPopup from "@/components/popups/ProductAddedPopup.vue";
import type {Product} from "@/types";

export default defineComponent({
  components: {ProductAddedPopup},
  setup() {
    const route = useRoute();
    const productStore = useProductsStore();
    const cartStore = useCartStore();
    const productId = Number(route.params.id);

    const popupVisible = ref(false);
    const addToCartObject = ref<{ product: Product; size?: string } | null>(null);

    onMounted(async () => {
      await productStore.fetchProduct(productId);
      const images = productStore.getCurrentProduct?.media?.images;
      if (images) {
        const mainImage = images.find(image => image.isMain);
        if (mainImage) {
          selectedImageId.value = mainImage.id;
        }
      }
    });

    const product = computed(() => productStore.getCurrentProduct);
    const productImages = computed(() => productStore.getCurrentProduct?.media?.images);
    const sanitizedDescription = computed(() => DOMPurify.sanitize(product?.value?.description || ''));
    const selectedSize = ref<string | null>(null);
    const selectedColor = ref<string | null>(null);
    const selectedImageId = ref<number | null>(null);
    const selectedImageUrl = ref<string | null>(null);

    watch(() => product.value?.options, (options) => {
      if (options && options[0]?.choices.length > 0) {
        selectedSize.value = options[0]?.choices[0]?.text;
      }
    });

    const selectImage = (id: number) => {
      selectedImageId.value = id;
      const selectedImage = productImages.value?.find(e => e.id === id);
      selectedImageUrl.value = selectedImage?.image1500pxUrl ?? '';
    };

    const selectSize = (size: string) => {
      selectedSize.value = size;
    };

    const addToCart = () => {
      if (product.value) {
        if (product.value.options.length === 0 || selectedSize.value) {
          cartStore.addToCart(product.value, selectedSize.value);
          popupVisible.value = true;
          addToCartObject.value = {
            product: {...product.value},
            size: selectedSize.value ?? undefined
          }
          setTimeout(() => {
            popupVisible.value = false;
          }, 3000);
        } else {
          alert('Please select a size!');
        }
      } else {
        alert('Product not available!');
      }
    };

    const breadcrumbs = computed(() => {
      const categorySlug = route.params.category_slug;
      const categoryId = route.params.category_id;
      const productName = product.value?.name || 'Product';
      if(categoryId){
        return [
          { text: 'Home', to: '/' },
          { text: categorySlug, to: { name: 'CategoryPage', params: { slug: categorySlug, id: categoryId } } },
          { text: productName, disabled: true },
        ];
      }
      return [
        { text: 'Home', to: '/' },
        { text: productName, disabled: true },
      ];
    });

    const isLoadingProduct = computed(() => productStore.isLoadingProduct);

    const canAddToCart = computed(() => {
      if (product.value?.options.length === 0) {
        return true;
      }
      return !!selectedSize.value;
    });

    return {
      product,
      selectedSize,
      selectedColor,
      selectedImageId,
      sanitizedDescription,
      breadcrumbs,
      isLoadingProduct,
      productImages,
      selectedImageUrl,
      canAddToCart,
      popupVisible,
      addToCartObject,
      selectSize,
      selectImage,
      addToCart,
    };
  },
});
</script>

<style scoped>
.product-image {
  width: 100%;
  max-height: 700px;
  border-radius: 10px;
}

.product-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.product-info {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.product-info h2 {
  margin: 0;
}

.product-info .price {
  font-size: 1.5rem;
  margin-top: 10px;
  margin-bottom: 10px;
}

.description {
  margin-bottom: 20px;
  font-size: 1rem;
}

.v-btn {
  margin-top: 10px;
}

.size-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.size-button {
  width: 60px;
  height: 40px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.selected-size {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: bold;
  transform: scale(1.1);
}

.thumbnail-container {
  width: 100%;
  overflow: hidden;
}

.thumbnail {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.selected-thumbnail {
  border: 1px solid #000000;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.5);
  border-radius: 6px;
}
</style>
