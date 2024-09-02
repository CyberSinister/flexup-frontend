<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content pt-lg-8 pt-0 flex-column-fluid justify-content-center">
        <HeaderLeagal />
        <div id="kt_app_content_container" class="app-container container-fluid mt-lg-20 mt-sm-10 mt-10">
          <strong class="fs-2 ps-5">Legal</strong>
          <div class="d-flex justify-content-around py-4">
            <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6" role="tablist">
              <li class="nav-item" role="presentation">
                <a
                  class="nav-link cursor-pointer"
                  :class="{ active: selectedTab === 'terms' }"
                  @click="selectTab('terms')"
                  role="tab"
                >Terms of Service</a>
              </li>
              <li class="nav-item" role="presentation">
                <a
                  class="nav-link cursor-pointer"
                  :class="{ active: selectedTab === 'privacy' }"
                  @click="selectTab('privacy')"
                  role="tab"
                >Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div class="tab-content">
            <div v-if="selectedTab === 'terms'" class="fs-5">
              <TermsOfService />
            </div>
            <div v-if="selectedTab === 'privacy'" class="fs-5">
              <LegalPrivacyPolicy />
            </div>
          </div>
        </div>
      </div>
      <FooterLegal />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const defaultTab = 'terms'; // Default tab
    const selectedTab = ref(defaultTab);

    // Function to set the tab and update the URL fragment
    const selectTab = (tab: string) => {
      selectedTab.value = tab;
      router.replace({ hash: tab === 'terms' ? '#termofservice' : '#privacypolicy' });
    };

    // Watch the route to update the selectedTab based on the hash
    watch(() => route.hash, (newHash) => {
      if (newHash === '#termofservice') {
        selectedTab.value = 'terms';
      } else if (newHash === '#privacypolicy') {
        selectedTab.value = 'privacy';
      } else {
        selectedTab.value = defaultTab; // Fallback to default if hash is unknown
      }
    }, { immediate: true });

    return {
      selectedTab,
      selectTab,
    };
  },
});
</script>

<style scoped>
.app-content {
  position: relative;
}
.nav-link.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}
</style>
