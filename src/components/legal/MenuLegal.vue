<template>
    <div class="app-navbar-item w-100 ms-2 ms-lg-6 me-lg-6">
      <div class="d-flex justify-content-end w-100 pe-xl-auto pe-lg-auto pe-md-3 pe-sm-3 pe-3">
        <div class="d-xl-flex d-lg-flex d-md-none d-sm-none d-none">
          <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary" id="account_information_drawer_toggle" title="FAQS: will integrate this directly in the app when you are done with it " v-tooltip>
              FAQS
            </div>
          </div>
          <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary" id="kt_drawer_chat_toggle" title="Documentation: will integrate this directly in the app when you're done with it" v-tooltip>
              DOCUMENT
            </div>
          </div>
          <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary" id="kt_drawer_chat_toggle" title="Blog: For the love of god Fabrizio, let me create a BLOG module in this app for you and make your life easier (with comments, reactions and everything) - all in one place" v-tooltip>
              BLOG
            </div>
          </div>
          <div v-if="!authStore.isAuthenticated" class="d-flex AuthButton">
            <div class="app-navbar-item ms-2">
              <router-link
                to="/auth#login"
                class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded-end-0 bg-hover-dark text-hover-white"
              >
                Sign In
              </router-link>
            </div>
            <div class="app-navbar-item me-8">
              <router-link
                to="/auth#signup"
                class="btn btn-outline btn-outline text-white bg-dark h-40px btn-flex w-auto rounded-start-0 bg-hover-light text-hover-dark"
              >
                Sign Up
              </router-link>
            </div>
          </div>
          <div v-else>
            <template v-if="hasAuthMiddleware">
              <div class="app-navbar-item ms-2">
                <router-link
                  to="/auth#login"
                  class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded-end-0 bg-hover-dark text-hover-white"
                >
                  We gooot
                </router-link>
              </div>
            </template>
            <p class="mt-4" v-else>
              <div class="app-navbar-item ms-2">
                <a
                  href="javascript:void(0)"
                  class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded bg-hover-dark text-hover-white"
                  @click="logout"
                >
                  Sign Out
                </a>
              </div>
            </p>
          </div>
        </div>
        <div class="d-xl-none d-lg-none d-md-flex d-sm-flex d-flex">
          <div class="app-navbar-item bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary p-md-4 p-2" id="account_information_drawer_toggle">
              <i class="ki-duotone ki-message-question fs-2x">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </div>
          </div>
          <div class="app-navbar-item bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary p-md-4 p-2" id="kt_drawer_chat_toggle">
              <i class="ki-duotone ki-document fs-2x">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
          </div>
          <div class="app-navbar-item bg-hover-secondary rounded">
            <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary p-md-4 p-2" id="kt_drawer_chat_toggle">
              <i class='fas fa-blog fs-2x'></i>
            </div>
          </div>
          <div v-if="!authStore.isAuthenticated" class="d-flex AuthButton">
            <div class="app-navbar-item">
              <router-link
                to="/auth#login"
                class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded-end-0 bg-hover-dark text-hover-white p-md-4 p-2"
              >
                Sign In
              </router-link>
            </div>
            <div class="app-navbar-item">
              <router-link
                to="/auth#signup"
                class="btn btn-outline btn-outline text-white bg-dark h-40px btn-flex w-auto rounded-start-0 bg-hover-light text-hover-dark p-md-4 p-2"
              >
                Sign Up
              </router-link>
            </div>
          </div>
          <div v-else>
            <template v-if="hasAuthMiddleware">
              <div class="app-navbar-item ms-2">
                <router-link
                  to="/auth#login"
                  class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded bg-hover-dark text-hover-white"
                >
                  We gooot
                </router-link>
              </div>
            </template>
            <p class="mt-4" v-else>
              <div class="app-navbar-item">
                <a
                  href="javascript:void(0)"
                  class="btn btn-outline btn-outline h-40px btn-flex w-auto rounded-end-0 bg-hover-dark text-hover-white p-md-4 p-2"
                  @click="logout"
                >
                  Sign Out
                </a>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Adjust the import path as needed
import { useRouter } from "vue-router";

export default defineComponent({
	name: "SignIn",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const hasAuthMiddleware = computed(() => {
      return router.currentRoute.value.meta.middleware === 'auth';
    });

    const logout = () => {
      authStore.logout();
    }

    return {
      hasAuthMiddleware, logout,
      authStore
    }
  }
})
</script>
