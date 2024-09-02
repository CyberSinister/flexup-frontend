<!-- Menu.vue -->
<template>
  <div
    id="#kt_aside_menu_wrapper"
    ref="scrollElRef"
    data-kt-scroll="true"
    data-kt-scroll-height="auto"
    data-kt-scroll-dependencies="{default: '#kt_aside_toolbar, #kt_aside_footer', lg: '#kt_header, #kt_aside_toolbar, #kt_aside_footer'}"
    data-kt-scroll-wrappers="#kt_aside_menu"
    data-kt-scroll-offset="5px"
    data-kt-menu="true"
    data-kt-menu-expand="false"
    class="hover-scroll-overlay-y px-2 my-5 my-lg-5 app-sidebar-menu-primary menu menu-column menu-rounded menu-sub-indention menu-state-bullet-primary "
  >
    <div
        id="#kt_aside_menu"
        class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
        data-kt-menu="true"
      >
        <div data-kt-menu-trigger="click" class="menu-item  menu-accordion " :class="{ 'here show': isPrimaryRouteActive('flexup') }">
          <span class="menu-link">
            <span class="menu-icon mx-2">
              <i class="ki-outline ki-home-2 fs-3"></i>
            </span>
            <span
              :class="[
                { 'd-none' : !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered && asideWidth >= '90px'},
              ]"
              class="menu-title overflow-hidden"
            >
              FlexUp
            </span>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-arrow menu-title-transition"
            ></span>
          </span>
          <div
            class="menu-sub menu-sub-accordion menu-title-transition"
            :class="{ 'd-none': !isHovered && asideWidth === '90px'} "
          >
            <div class="menu-item">
              <!-- Use RouterLink with active-class for dynamic styling -->
              <div
                class="menu-link "
                :class="{ 'active': isRouteActive('/dashboard')}"
              >
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">
                  <router-link to="/dashboard" class="link-dark" :class="{ 'link-primery': isRouteActive('/dashboard')}" >Default</router-link>
                </span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Memberships</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">User Profile</span>
              </div>
            </div>
            <div class="menu-inner flex-column collapse" id="kt_app_sidebar_menu_dashboards_collapse" style="">
              <div class="menu-item">
                <a class="menu-link" href="#" v-tooltip:top="`You still brought your cursor here... but this is to show you that this is something we can do with the sidebar`">
                  <span class="menu-bullet">
                    <span class="bullet bullet-dot"></span>
                  </span>
                  <span class="menu-title overflow-hidden">Gotcha!</span>
                </a>
              </div>
            </div>
            <div class="menu-item" bis_skin_checked="1">
              <div class="menu-content" bis_skin_checked="1">
                <a class="btn btn-flex btn-color-primary d-flex flex-stack fs-base p-0 ms-2 mb-2 toggle collapsible collapsed" data-bs-toggle="collapse" href="#kt_app_sidebar_menu_dashboards_collapse" data-kt-toggle-text="Show Less" aria-expanded="false">
                  <span data-kt-toggle-text-target="true" class="overflow-hidden">Show a bit More</span>
                  <i class="ki-outline ki-minus-square toggle-on fs-2 me-0"></i>
                  <i class="ki-outline ki-plus-square toggle-off fs-2 me-0"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion" :class="{ 'here show': isPrimaryRouteActive('transactions') }">
          <span class="menu-link">
            <div class="menu-icon mx-2">
              <i class="ki-duotone ki-arrow-right-left fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-title menu-title-transition overflow-hidden"
            >
              Transactions
            </span>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-arrow"
            ></span>
          </span>
          <div
            class="menu-sub menu-sub-accordion menu-title-transition"
            :class="{ 'd-none': !isHovered && asideWidth === '90px'}"
          >
            <div class="menu-item">
              <!-- Use RouterLink with active-class for dynamic styling -->
              <div class="menu-link"
                :class="{ 'active': isRouteActive('/products')}"
              >
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title menu-title-transition overflow-hidden">
                  <router-link to="/products" class="link-dark" :class="{ 'link-primery': isRouteActive('/products')}" >Products</router-link>
                </span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Lettering</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Orders</span>
              </div>
            </div>
          </div>
        </div>
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion " :class="{ 'here show': isPrimaryRouteActive('configuration') }">
          <span class="menu-link">
            <div class="menu-icon mx-2">
              <i class="ki-duotone ki-gear fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-title menu-title-transition overflow-hidden"
            >
              Configuration
            </span>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-arrow"
            ></span>
          </span>
          <div
            class="menu-sub menu-sub-accordion menu-title-transition"
            :class="{ 'd-none': !isHovered && asideWidth === '90px'}"
          >
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Third Parties</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Payment Terms</span>
              </div>
            </div>
          </div>
        </div>
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion " :class="{ 'here show': isPrimaryRouteActive('account') }">
          <span class="menu-link">
            <div class="menu-icon mx-2">
              <i class="ki-duotone ki-user-tick fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </div>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-title menu-title-transition overflow-hidden"
            >
              Account
            </span>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-arrow"
            ></span>
          </span>
          <div
            class="menu-sub menu-sub-accordion menu-title-transition"
            :class="{ 'd-none': !isHovered && asideWidth === '90px'}"
          >
          <div class="menu-item">
              <div class="menu-link" 
                :class="{ 'active': isRouteActive('/accounts')}"
              >
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">
                    <router-link to="/accounts" class="link-dark" :class="{ 'link-primery': isRouteActive('/accounts')}" >Accounts</router-link>
                </span>

              </div>
            </div>
            <div class="menu-item">
              <!-- Use RouterLink with active-class for dynamic styling -->
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Account Information</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Members</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">Subaccounts</span>
              </div>
            </div>
          </div>
        </div>
        <div data-kt-menu-trigger="click" class="menu-item menu-accordion " :class="{ 'here show': isPrimaryRouteActive('users') }">
          <span class="menu-link">
            <div class="menu-icon mx-2">
              <i class="ki-outline ki-briefcase fs-2"></i>
            </div>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-title menu-title-transition overflow-hidden"
            >
              Users
            </span>
            <span
              :class="[
                { 'd-none': !isHovered && asideWidth === '90px' },
                { 'd-flex': isHovered },
              ]"
              class="menu-arrow"
            ></span>
          </span>
          <div
            class="menu-sub menu-sub-accordion menu-title-transition"
            :class="{ 'd-none': !isHovered && asideWidth === '90px'}" 
          >
            <div class="menu-item">
              <!-- Use RouterLink with active-class for dynamic styling -->
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden ">My Memberships</span>
              </div>
            </div>
            <div class="menu-item">
              <div class="menu-link">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title overflow-hidden">User Profile</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
    
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { PropType } from "vue";
import { asideWidth } from "@/layouts/default-layout/config/helper";
import { useRoute } from 'vue-router';

export default defineComponent({
  props: {
    isHovered: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(props) {
    const isAsideWidth65px = ref(asideWidth);
    const isVisible = ref(false);
    const showFlex = ref(false);
    const isHovered = ref(false);
    const route = useRoute();
    const isRouteActive = (path: string) => route.path.startsWith(path); // Determines if the route matches the current one
    const primaryMenuRoutes = {
      flexup: ['/dashboard', '/memberships', '/userprofile', '/gotcha'],
      transactions: ['/products', '/orders', '/invoices'],
      configuration: ['/thirdparties', '/paymentterms'],
      account: ['/accounts', '/members', '/subaccounts'],
      users: ['/mymemberships', '/userprofile'],
    };
    const isPrimaryRouteActive = (menu: string) => {
      return primaryMenuRoutes[menu].some((path: string) => isRouteActive(path));
    };

    return {
      asideWidth,
      isAsideWidth65px,
      isVisible,
      isRouteActive,
      isPrimaryRouteActive, 
    };
  },
});
</script>
<style scoped>
.menu-item {
  transition: 0.6s ease !important;
}
.menu-item .menu-title {
  transition: 0.6s ease !important;
}
.menu-item .menu-title .link-primery{
  color: #0d6efd !important;
}
  
</style>

