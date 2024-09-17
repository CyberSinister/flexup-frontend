<template>
    <div class="page d-flex flex-row flex-column-fluid">
        <!-- <Header /> -->
        <Header />
        <Aside v-if="asideEnabled" :lightLogo="themeLightLogo" :darkLogo="themeDarkLogo"
            style="transition: 0.5s ease !important;" />
        <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid">
            <div id="kt_content" class="content d-flex flex-column flex-column-fluid">
                <div class="app-main flex-column flex-row-fluid me-0" id="kt_app_main">
                    <div class="d-flex flex-column flex-column-fluid">
                        <div
                        id="kt_app_content"
                        class="app-content flex-column-fluid"
                        >
                            <router-view />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";


import { getAssetPath } from "@/core/helpers/assets";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import {
    asideEnabled,
    contentWidthFluid,
    loaderEnabled,
    loaderLogo,
    subheaderDisplay,
    themeDarkLogo,
    themeLightLogo,
    headerWidthFluid,
    headerLeft,
    asideDisplay,
    asideMinimized,
} from "@/layouts/default-layout/config/helper";
import LayoutService from "@/core/services/LayoutService";
import { useAuthStore } from "@/stores/auth";
import { useAccountsStore } from "@/stores/accounts";

export default defineComponent({
    name: "default-layout",

    setup() {

        const route = useRoute();
        const authStore = useAuthStore();
        const accountStore = useAccountsStore();

        onBeforeMount(() => {
            LayoutService.init();
        });

        onMounted(() => {
            nextTick(() => {
                reinitializeComponents();
            });
        });

        watch(
            () => route.path,
            () => {
                nextTick(() => {
                    reinitializeComponents();
                });
            }
        );

        accountStore.fetchAccounts();
        console.log(accountStore.accounts);

        return {
            loaderEnabled,
            contentWidthFluid,
            loaderLogo,
            asideEnabled,
            subheaderDisplay,
            themeLightLogo,
            themeDarkLogo,
            headerWidthFluid,
            headerLeft,
            asideDisplay,
            asideMinimized,
            getAssetPath,
        };
    },
});
</script>

<style scoped>
.header-wrapper {
    position: relative;
    z-index: 1000;
    width: 100%;
    background-color: white;
}

#kt_wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex: 1;
}
</style>
