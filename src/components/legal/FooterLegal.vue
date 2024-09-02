<template>
  <div id="kt_app_footer" class="app-footer " bis_skin_checked="1">
    <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3 " bis_skin_checked="1">
        
        <div class="text-gray-900 order-2 order-md-1" bis_skin_checked="1">
            <span class="text-muted fw-semibold me-1">2021©</span>
            <a href="https://silquetech.com/" target="_blank" class="text-gray-800 text-hover-primary">Cosys S.C</a>
        </div>

        <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
            <li class="menu-item">
                <router-link
                  to="/legal"
                  class="menu-link px-2"
                  role="tab"
                >Legal
                </router-link>
            </li>
            <li class="menu-item">
              <a href="https://silquetech.com/contact" target="_blank" class="menu-link px-2">Silquetech</a>
            </li>
            <li class="menu-item">
              <a href="https://api.whatsapp.com/send?phone=447465871650&text=Hello%20Silquetech!%0AThis%20is%20Fabrizio%2C%20client%20167%20inquiring%20about%20the%20FlexUp%20project%20you%20created%20for%20Cosys.%0AI%27ve%20unfortunately%20ran%20into%20an%20issue%20%F0%9F%98%94" target="_blank" class="menu-link px-2">Support</a>
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
