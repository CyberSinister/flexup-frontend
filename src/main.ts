// src/main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";
import "./assets/css/style.bundle.css";
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiArchive, BiArchiveFill, HiSolidArchive } from 'oh-vue-icons/icons';

import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import "@/core/plugins/prismjs";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
ApiService.init(app);
addIcons(HiSolidArchive, BiArchiveFill, BiArchive);
app.component('v-icon', OhVueIcon);

initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();
app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount("#app");
