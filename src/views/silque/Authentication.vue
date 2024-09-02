<template>
  
</template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useAuthStore, type User } from "@/stores/auth";

  export default defineComponent({
    name: "authentication-view",
    setup() {
      const store = useAuthStore();
      return {
        
      };
    },
  });
  </script>
  