<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";
</script>
