<template>
  <div id="kt_app_header" class="app-header  d-flex flex-column flex-stack bg-body-tertiary shadow-sm" style="height: 75px !important;">
    <div class="d-flex flex-stack flex-grow-1 px-xl-0 px-md-8 px-sm-8 px-5">
      <div class="app-header-logo d-flex align-items-center justify-content-center w-lg-350px w-md-350px w-sm-0 w-0" id="kt_app_header_logo">
        <div
          v-if="asideDisplay"
          id="kt_app_sidebar_toggle"
          :class="{ active: asideMinimized }" 
          class="app-sidebar-toggle btn btn-sm btn-icon btn-color-gray-500 btn-active-color-primary bg-white w-30px h-30px ms-n2 me-4 d-none d-lg-flex"
          @click="toggleAsideWidth"
        >
          <i class="ki-outline ki-abstract-14 fs-3 mt-1"></i>
        </div>
        <!--begin::Aside toggle-->
        <div
          class="d-flex align-items-center d-lg-none ms-n3 me-1"
          title="Show aside menu"
        >
          <div
            class="btn btn-icon btn-active-color-primary w-30px h-30px"
            id="kt_aside_mobile_toggle"
          >
            <KTIcon icon-name="abstract-14" icon-class="fs-1" />
          </div>
        </div>
        <!--end::Aside toggle-->
        <a href="#" class="app-sidebar-logo d-md-block d-sm-none d-none">
          <img class="w-150px" :src="getAssetPath('media/logos/logoFlexUp.svg')" alt="Logo" />
        </a>
      </div>
      <div class="app-navbar flex-grow-lg-1 justify-content-end justify-content-lg-between w-100" id="kt_app_header_navbar">
        <KTMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAssetPath } from "@/core/helpers/assets";
import { asideDisplay, asideMinimized } from "@/layouts/default-layout/config/helper";
import { useConfigStore } from "@/stores/config";
import KTMenu from "@/layouts/default-layout/components/header/Menu.vue";

export default defineComponent({
  name: 'AppHeader',
  components: {
    KTMenu,
  },
  setup() {
    const configStore = useConfigStore();

    function toggleAsideWidth() {
      configStore.toggleAsideWidth(); // Call the toggle function from the store
      console.log('clicked')
    }

    return {
      asideDisplay,
      asideMinimized,
      toggleAsideWidth,
      getAssetPath, // Add this method to access asset paths
    };
  },
});
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .app-header-logo {
    display: flex;
    align-items: center;
  }

  .app-sidebar-toggle {
    cursor: pointer;
  }
}
</style>
