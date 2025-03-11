<template>
  <v-footer app>
    <v-col class="text-center">
      <span>&copy; 2025 Ecwid</span>
    </v-col>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    const goToPrivacyPolicy = (): void => {
      router.push('/privacy-policy');
    };

    return { goToPrivacyPolicy };
  },
});
</script>

<style scoped>
.v-footer {
  background-color: #f8f8f8;
  padding: 10px 0;
}
</style>
