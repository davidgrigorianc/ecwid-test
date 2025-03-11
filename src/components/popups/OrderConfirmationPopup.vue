<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="600px"
  >
    <v-card class="order-card">
      <v-card-title class="order-card-title">
        <span>Order Confirmation</span>
      </v-card-title>

      <v-card-text>
        <p class="congrats-message">
          Thank you for your order!
        </p>

        <div class="order-summary">
          <p><strong>Order Number:</strong> {{ orderNumber }}</p>
          <p><strong>Estimated Delivery:</strong> {{ formattedDeliveryDate }}</p>

          <div class="items-summary">
            <p><strong>Items:</strong></p>
            <ul>
              <li
                v-for="item in items"
                :key="item.id"
              >
                {{ item.product.name }} <span v-if="item.size"> | Size: {{ item.size }}</span> (x{{ item.quantity }})
              </li>
            </ul>
          </div>

          <div class="total-price">
            <p><strong>Total Price:</strong> € {{ totalAmount }}</p>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="action-buttons">
        <v-btn
          color="primary"
          @click="closeConfirmation"
        >
          Close
        </v-btn>
        <v-btn
          color="secondary"
          @click="continueShopping"
        >
          Continue Shopping
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import router from "@/router";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    order: {
      type: Object as () => {
        orderNumber: string;
        items: {
          id: number;
          product: { name: string };
          quantity: number;
          size?: string
        }[] ;
        totalAmount: number;
      },
      required: true
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const dialogVisible = ref(props.visible);

    watch(() => props.visible, (newVal) => {
      dialogVisible.value = newVal;
    });

    const closeConfirmation = (): void => {
      dialogVisible.value = false;
      emit('update:visible', false);
    };

    const continueShopping = (): void => {
      router.push('/');
    };

    const today = new Date();
    const estimatedDeliveryDate = new Date(today.setDate(today.getDate() + 10));

    const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      dialogVisible,
      closeConfirmation,
      continueShopping,
      formattedDeliveryDate,
      orderNumber: props.order.orderNumber,
      totalAmount: props.order.totalAmount,
      items: props.order.items
    };
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

.v-card-title {
  background-color: #f8f9fa;
  padding: 16px;
  text-align: center;
  font-weight: 500;
}

.congrats-message {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 15px;
}

.order-summary {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.items-summary ul {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
}

.items-summary li {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.v-btn {
  margin-top: 15px;
}
</style>
