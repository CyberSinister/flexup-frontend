<template>
  <div>
    <div id="kt_app_header" class="app-header flex-stack w-100 d-flex bg-body-tertiary shadow-none ">
      <div class="d-flex flex-grow-1 ps-4 pe-1">
        <div class="app-header-logo d-flex align-items-center ps-lg-12" id="kt_app_header_logo">
          <a href="#" class="app-sidebar-logo">
            <img class="w-xl-175px w-lg-175px w-md-175px w-sm-100px w-100px" :src="getAssetPath('media/logos/logoFlexUp.svg')" alt="Logo" />
          </a>
        </div>
        <div class="app-navbar d-flex align-items-center w-100" id="kt_app_header_navbar">
          <MenuLegal />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
  import { defineComponent } from 'vue';
  import { getAssetPath } from "@/core/helpers/assets";
  export default defineComponent({
    name: 'LegalHeader',
    setup() {
      return {
        getAssetPath,
      };
    },
  });
</script>
  
  <style scoped>
  #kt_app_header {
    height: 80px; /* Adjust height as needed */
    z-index: 1000;
  }
  
  </style>
  