<template>
    <div class="app-navbar-item w-100">
        <div class="d-flex justify-content-lg-between justify-content-md-between justify-content-sm-end justify-content-end w-100 ps-8 pe-6 ">
            <form data-kt-search-element="form" class="d-none w-350px d-lg-block position-relative mb-5 mb-lg-0" autocomplete="off">
                <input type="hidden">
                <i class="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-5"></i>
                <input type="text" class="search-input form-control form-control border h-lg-45px ps-13" name="search" placeholder="Search..." data-kt-search-element="input">
                <span class="search-spinner position-absolute top-50 end-0 translate-middle-y lh-0 me-5 d-none" data-kt-search-element="spinner">
                    <span class="spinner-border h-15px w-15px align-middle text-gray-500"></span>
                </span>
                <span class="search-reset btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4 d-none" data-kt-search-element="clear">
                    <i class="ki-outline ki-cross fs-2 fs-lg-1 me-0"></i>
                </span>
            </form>
            
            <div class="d-flex">
                <div class="d-lg-flex d-md-flex d-sm-none d-none">
                    <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
                        <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary fs-lg-5"
                            id="account_information_drawer_toggle"
                            title="FAQS: will integrate this directly in the app when you are done with it " v-tooltip>
                            FAQS
                        </div>
                    </div>
                    <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
                        <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary" id="kt_drawer_chat_toggle"
                            title="Documentation: will integrate this directly in the app when you're done with it"
                            v-tooltip>
                            DOCUMENT
                        </div>
                    </div>
                    <div class="app-navbar-item ms-2 bg-hover-secondary rounded">
                        <div class="btn btn-custom btn-color-gray-600 btn-active-color-primary" id="kt_drawer_chat_toggle"
                            title="Blog: For the love of god Fabrizio, let me create a BLOG module in this app for you and make your life easier (with comments, reactions and everything) - all in one place"
                            v-tooltip>
                            BLOG
                        </div>
                    </div>
                </div>

                <div class="d-lg-none d-md-none d-sm-flex d-flex">
                    <div class="app-navbar-item ms-2 ms-lg-6 bg-hover-dark rounded">
                        <div class="btn btn-icon btn-custom btn-color-gray-600 btn-active-color-primary w-35px h-35px w-md-40px h-md-40px" id="account_information_drawer_toggle" title="FAQS: will integrate this directly in the app when you are done with it " v-tooltip >
                            <a href="https://flexup.notion.site/FlexUp-frequently-asked-questions-in-English-98b23c1eb72341c7bea0d07f2649b130" target="_blank">
                                <i class="ki-duotone ki-message-programming fs-1">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                    <span class="path4"></span>
                                </i>
                            </a>
                        </div>
                    </div>
                    <div class="app-navbar-item ms-2 ms-lg-6 bg-hover-dark rounded">
                        <div class="btn btn-icon btn-custom btn-color-gray-600 btn-active-color-primary w-35px h-35px w-md-40px h-md-40px position-relative" id="kt_drawer_chat_toggle" title="Documentation: will integrate this directly in the app when you're done with it" v-tooltip>
                            <a href="https://flexup.notion.site/FlexUp-documentation-31e2096d96e74e59a0ce7f7c3dbb34cc" target="_blank">
                                <i class="ki-duotone ki-scroll fs-1">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </a>
                        </div>
                    </div>
                    <div class="app-navbar-item ms-2 ms-lg-6 me-lg-1 bg-hover-dark rounded">
                        <div class="btn btn-icon btn-custom btn-color-gray-600 btn-active-color-primary w-35px h-35px w-md-40px h-md-40px position-relative" id="kt_drawer_chat_toggle" title="Blog: For the love of god Fabrizio, let me create a BLOG module in this app for you and make your life easier (with comments, reactions and everything) - all in one place" v-tooltip >
                            <a href="https://flexup.notion.site/FlexUp-Blog-33d540370c874a75a14cd1fa8f8c814b" target="_blank">
                                <i class="ki-duotone ki-message-question fs-1">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="app-navbar-item ms-2 ms-lg-6" id="kt_header_user_menu_toggle">
                    <div class="d-flex align-items-center">
                        <button type="button" 
                            data-kt-element="selected" 
                            class="btn border border-1 border-gray-300 h-40px btn-flex w-auto w-md-200px ps-4 pe-8 bg-hover-gray-300 text-hover-dark menu-dropdown" 
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" 
                            :class="{'btn-outline-warning': loadingAccounts, 'btn-outline-danger': accountsLoadingFailed, 'btn-outline-gray': (currentAccount && Object.keys(currentAccount).length > 0 && !loadingAccounts && !accountsLoadingFailed)}"
                        >
                            <template v-if="loadingAccounts">
                                <span class="d-flex flex-center me-3">
                                    <span class="spinner-border"></span>
                                </span>
                                <span class="d-none d-md-flex flex-grow-1 text-start fs-8 fw-semibold text-gray-700 text-hover-dark">Loading accounts...</span>
                                <span class="d-flex flex-column me-n4">
                                    <i class="ki-outline ki-up fs-7 text-gray-500 h-10px"></i>
                                    <i class="ki-outline ki-down fs-7 text-gray-500 h-10px"></i>
                                </span>
                            </template>
                            <template v-else-if="(currentAccount && Object.keys(currentAccount).length > 0)">
                                <span class="d-flex flex-center me-3">
                                    <div class="symbol symbol-30px symbol-circle">
                                        <div class="symbol-label fs-2 fw-semibold border border-info" :style="`background-image: url(${currentAccount.image?(currentAccount.image.includes('http')?currentAccount.image:baseUrl+currentAccount.image):'/public/media/logos/flexup-circle-color.svg'})`">
                                            <!-- <img alt="img" :src="account.image?account.image:'/public/media/logos/flexup-circle-color.svg'" data-kt-element="img" class="h-25px"> -->
                                        </div>
                                    </div>
                                    <!-- <img alt="img" :src="" data-kt-element="img" class="h-20px"> -->
                                </span>
                                <span class="d-none d-md-flex flex-grow-1 text-start fs-6 fw-semibold text-gray-700">{{ currentAccount.account_name }}</span>
                                <span class="d-flex flex-column me-n4">
                                    <i class="ki-outline ki-up fs-7 text-gray-500 h-10px"></i>
                                    <i class="ki-outline ki-down fs-7 text-gray-500 h-10px"></i>
                                </span>
                            </template>
                            <template v-else>
                                <span class="d-flex flex-center me-3">
                                    <img alt="img" src="/public/media/logos/apple-black.svg" data-kt-element="img" class="h-20px">
                                </span>
                                <span class="d-none d-md-flex flex-grow-1 text-start fs-6 fw-semibold text-gray-700" data-kt-element="title">No accounts found</span>
                                <span class="d-flex flex-column me-n4">
                                    <i class="ki-outline ki-up fs-7 text-gray-500 h-10px"></i>
                                    <i class="ki-outline ki-down fs-7 text-gray-500 h-10px"></i>
                                </span>
                            </template>
                        </button>
                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-state-bg menu-rounded w-300px ps-3" data-kt-menu="true" data-popper-placement="start">
                            <div class="hover-scroll-y mh-350px my-3 me-n1">
                                <div class="menu-item w-100 d-flex align-items-center px-3 py-4">
                                    <span class="text-nowrap me-3">My Accounts</span>
                                    <div class="separator my-2 w-100 border-dark"></div>
                                </div>
                                <div v-for="(account, account_arrayId) in accounts" class="menu-item">
                                    <a href="#" class="menu-link px-3 py-3 justify-content-between text-gray-700 text-hover-info bg-hover-light-info" :class="{'bg-light-info border border-info': (currentAccount && currentAccount.id == account.id)}" style="min-width: 0;" data-kt-element="project" @click="switchAccount(account.id)">
                                        <div class="d-flex align-items-center" style="min-width: 0;">
                                            <span class="d-flex flex-center flex-shrink-0 me-3">
                                                <div class="symbol symbol-40px symbol-circle">
                                                    <div class="symbol-label fs-2 fw-semibold border border-info" :style="`background-image: url(${account.image?account.image:'/public/media/logos/flexup-circle-color.svg'})`">
                                                        <!-- <img alt="img" :src="account.image?account.image:'/public/media/logos/flexup-circle-color.svg'" data-kt-element="img" class="h-25px"> -->
                                                    </div>
                                                </div>
                                            </span>
                                            <el-tooltip :content="account.account_name">
                                                <span class="d-block w-100 text-truncate fs-5 fw-bold">
                                                    {{ account.account_name }}
                                                </span>
                                            </el-tooltip>
                                        </div>
                                        <div class="d-flex">
                                            <span class="menu-badge cursor-default">
                                                <span class="badge badge-circle badge-light-primary px-1" :title="`This is ${emojis.account_types[account.account_type][1]} account`" v-tooltip>{{ emojis.account_types[account.account_type][0] }}</span>
                                            </span>
                                            <span class="menu-badge cursor-default" :title="`Your role on this account is: ${accountStore.getAccountMember(account, user.id)?.role ? emojis.member_roles[accountStore.getAccountMember(account, user.id).role][1] : 'Unknown'}`" v-tooltip>
                                                <span class="badge badge-circle badge-light-primary px-1">{{ accountStore.getAccountMember(account, user.id)?.role ? emojis.member_roles[accountStore.getAccountMember(account, user.id).role][0] : 'Unknown' }}</span>
                                            </span>
                                            <span class="menu-badge cursor-default" :title="`${Object.keys(account.members).length} Member(s) on this account`" v-tooltip>
                                                <span class="badge badge-circle badge-light-primary px-1">{{ Object.keys(account.members).length }}</span>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                                <div class="separator my-2"></div>
                                <div class="menu-item w-100 d-flex align-items-center px-3 py-4">
                                    <span class="text-nowrap me-3">User Profile</span>
                                    <div class="separator my-2 w-100 border-dark"></div>
                                </div>
                                <div class="menu-item px-3 mb-3">
                                    <div class="menu-link menu-link menu-content d-flex align-items-center px-3">
                                        <div class="symbol symbol-50px me-5">
                                            <img alt="Logo" src="/public/media/logos/flexup-circle-color.svg">
                                        </div>
                                        <div class="d-flex flex-column" style="min-width: 0;">
                                            <div class="fw-bold d-flex align-items-center fs-5 justify-content-between" style="min-width: 0">
                                                <div class="d-block text-truncate">
                                                    <el-tooltip :content="`${user.primary_individual.first_name} ${user.primary_individual.last_name}`">
                                                        {{ user.primary_individual.first_name }} {{ user.primary_individual.last_name }}
                                                    </el-tooltip>
                                                </div>
                                                <el-tooltip content="FlexUp is currently in it's BETA testing stage">
                                                    <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">BETA</span>
                                                </el-tooltip>
                                            </div>
                                            <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">{{ user.email }}</a>
                                        </div>
                                    </div>
                                </div>
                                <a class="menu-item px-3 mb-3 cursor-pointer fw-semibold text-muted text-hover-primary fs-7 py-3 bg-gray-200 btn border border-hover-gray-200 border-2 d-flex justify-content-around" href="javascript:void(0);" @click="authStore.logout()">
                                    <span class="d-flex align-items-center">
                                        <i class="ki-duotone ki-entrance-right me-2 fs-2">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>Sign Out
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getAssetPath } from "@/core/helpers/assets";
import { useAccountsStore, type Account } from "@/stores/accounts";
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import { emojis } from "@/core/helpers/emojis";
import ApiService from "@/core/services/ApiService";

const accountStore = useAccountsStore();
const authStore = useAuthStore();

const baseUrl = ApiService.getBaseUrl();

const accounts = computed(() => accountStore.accounts);
const currentAccount = computed(() => accountStore.currentAccount);
const loadingAccounts = computed(() => accountStore.loadingAccounts);
const accountsLoadingFailed = computed(() => accountStore.accountsLoadingFailed);


const user = authStore.getUser();

const switchAccount = (accountId: number) => {
    const account = accountStore.accounts.find(acc => acc.id === accountId);
    if (account) {
        accountStore.setAccount(account);
    }
}

const getAccountMember = (account, userId) => {
    return account.account_members.find(member => member.user.id === userId) || {};
}
</script>