<template>
  <div id="kt_app_footer" class="app-footer " bis_skin_checked="1">
    <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3 " bis_skin_checked="1">
        
      <div class="text-gray-900 order-2 order-md-1" bis_skin_checked="1">
        <a href="https://flexup.app" target="_blank" class="text-gray-800 text-hover-primary text-muted fw-semibold">FlexUp </a>
        <span class="text-muted fw-semibold me-1">© 2024</span>
      </div>
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a href="/legal#termsofservice" target="_blank" class="menu-link px-2">Terms of Service</a>
        </li>
        <li class="menu-item">
          <a href="/legal#privacypolicy" target="_blank" class="menu-link px-2">Privacy Policy</a>
        </li>
      </ul>
        
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footerWidthFluid } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "KTFooter",
  setup() {
    return {
      footerWidthFluid,
    };
  },
});
</script>
