<template>
  <div
    id="kt_app_sidebar"
    class="app-sidebar mt-20 flex-column bg-body-tertiary"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_mobile_toggle"
    :class="{ 'aside-hovered': isHovered, 'drawer drawer-start drawer-on': isWindowWidth }"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    :style="{ width: asideWidth }"
  >
    <div class="aside-menu flex-column-fluid mt-lg-5 mt-md-5 mt-sm-0 mt-0">
      <a href="#" class="app-sidebar-logo d-lg-none d-md-none d-sm-flex ms-sm-9 m-9 d-flex">
        <img class="w-150px" :src="getAssetPath('media/logos/logoFlexUp.svg')" alt="Logo" />
      </a>
      <KTMenu :isHovered="isHovered" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import KTMenu from "@/layouts/default-layout/components/aside/Menu.vue";
import { asideWidth } from "@/layouts/default-layout/config/helper";
import { getAssetPath } from "@/core/helpers/assets";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
  },
  setup() {
    const isHovered = ref(false);
    const isWindowWidth = ref(window.innerWidth <= 992);

    const updateWindowWidth = () => {
      isWindowWidth.value = window.innerWidth <= 992;
    };

    onMounted (() => {
      window.addEventListener('resize',updateWindowWidth)
    });


    return {
      asideWidth,
      isHovered,
      getAssetPath,
      isWindowWidth
    };
  },
});
</script>

<style scoped>
.aside-hovered {
  width: 300px !important;
}
.aside .menu-link{
	transition: 0.4s ease !important;
}
</style>
