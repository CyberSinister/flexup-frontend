<template>
  <authHeader />
  <div 
    class="d-flex flex-column-fluid  justify-content-between p-12 p-lg-20" 
    style="background-image: url(media/misc/bg4.jpg); background-attachment: fixed;"
  >
    <div class="d-flex flex-column flex-center w-lg-50 order-1">
      <!-- Conditionally render based on the route props -->
      <SignIn v-if="authModule === 'login'" />
      <SignUp v-if="authModule === 'signup'" />
      <CompleteProfile v-if="authModule === 'completeProfile'" />
    </div>
    <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-lg-5 px-md-15 w-lg-50 order-2 d-none d-sm-flex">
      <router-link to="/" class="mb-0 mb-lg-12">
        <img
          alt="Logo"
          :src="getAssetPath('media/misc/flexup-long.svg')"
          class="h-100 d-xl-flex d-md-none"
        />
      </router-link>
      <h2 class="text-white fw-normal m-0 text-center d-xl-flex d-md-none">
        A simple and virtuous way to start and grow your business
      </h2>
    </div>
  </div>
  <authFooter />
  
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useBodyStore } from '@/stores/body';
import { useAuthStore } from '@/stores/auth';
import { getAssetPath } from '@/core/helpers/assets';
import LayoutService from '@/core/services/LayoutService';


export default defineComponent({
  name: 'AuthLayout',
  
  setup() {
    const bodyStore = useBodyStore();
    const authStore = useAuthStore();

    const authModule = computed(() => authStore.authModule);

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);
      bodyStore.addBodyClassname('app-blank');
      bodyStore.addBodyClassname('bg-body');
    });

    return {
      getAssetPath,
      authStore,
      authModule
    };
  },
});
</script>
