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
                            class="btn btn-outline btn-outline-dashed h-40px btn-flex w-auto w-md-200px ps-4 pe-8 menu-dropdown" 
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" 
                            :class="{'btn-outline-warning': loadingAccounts, 'btn-outline-danger': accountsLoadingFailed, 'btn-outline-info': (currentAccount && Object.keys(currentAccount).length > 0 && !loadingAccounts && !accountsLoadingFailed)}"
                        >
                            <template v-if="loadingAccounts">
                                <span class="d-flex flex-center me-3">
                                    <span class="spinner-border"></span>
                                </span>
                                <span class="d-none d-md-flex flex-grow-1 text-start fs-8 fw-semibold text-gray-700">Loading accounts...</span>
                                <span class="d-flex flex-column me-n4">
                                    <i class="ki-outline ki-up fs-7 text-gray-500 h-10px"></i>
                                    <i class="ki-outline ki-down fs-7 text-gray-500 h-10px"></i>
                                </span>
                            </template>
                            <template v-else-if="(currentAccount && Object.keys(currentAccount).length > 0)">
                                <span class="d-flex flex-center me-3">
                                    <div class="symbol symbol-30px symbol-circle">
                                        <div class="symbol-label fs-2 fw-semibold border border-info border-dashed" :style="`background-image: url(${currentAccount.image?currentAccount.image:'/public/media/logos/flexup-circle-color.svg'})`">
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
                            <div class="hover-scroll-y mh-250px my-3 me-n1">
                                <div class="menu-item w-100 d-flex align-items-center px-3 py-4">
                                    <span class="text-nowrap me-3">My Accounts</span>
                                    <div class="separator my-2 w-100 border-dark"></div>
                                </div>
                                <div v-for="(account, account_arrayId) in accounts" class="menu-item">
                                    <a href="#" class="menu-link px-3 py-3 justify-content-between" :class="{'bg-light-info': (currentAccount && currentAccount.id == account.id)}" data-kt-element="project" @click="switchAccount(account.id)">
                                        <div class="d-flex align-items-center">
                                            <span class="d-flex flex-center flex-shrink-0 me-3">
                                                <div class="symbol symbol-40px symbol-circle">
                                                    <div class="symbol-label fs-2 fw-semibold border border-info border-dashed" :style="`background-image: url(${account.image?account.image:'/public/media/logos/flexup-circle-color.svg'})`">
                                                        <!-- <img alt="img" :src="account.image?account.image:'/public/media/logos/flexup-circle-color.svg'" data-kt-element="img" class="h-25px"> -->
                                                    </div>
                                                    <span class="symbol-badge badge badge-circle bg-light-info start-100 badge-sm border border-info border-dashed text-info" :title="`${Object.keys(account.members).length} Members on this account`" v-tooltip>{{ Object.keys(account.members).length }}</span>
                                                </div>
                                            </span>
                                            <span class="d-flex flex-column align-items-start">
                                                <span class="fs-5 fw-bold text-gray-700" data-kt-element="title">{{ account.account_name }}</span>
                                            </span>
                                        </div>
                                        <div class="d-flex">
                                            <span class="menu-badge cursor-default">
                                                <span class="badge badge-light-info border border-info border-dashed px-1" :title="`This is ${emojis.account_types[account.account_type][1]} account`" v-tooltip>{{ emojis.account_types[account.account_type][0] }}</span>
                                            </span>
                                            <span class="menu-badge cursor-default" :title="`Your role on this account is: ${accountStore.getAccountMember(account, user.id)?.role ? emojis.member_roles[accountStore.getAccountMember(account, user.id).role][1] : 'Unknown'}`" v-tooltip>
                                                <span class="badge badge-light-info border border-info border-dashed px-1">{{ accountStore.getAccountMember(account, user.id)?.role ? emojis.member_roles[accountStore.getAccountMember(account, user.id).role][0] : 'Unknown' }}</span>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                                <div class="separator my-2"></div>
                                <div class="menu-item px-3 mb-3">
                                    <div class="menu-link menu-link menu-content d-flex align-items-center px-3">
                                        <div class="symbol symbol-50px me-5">
                                            <img alt="Logo" src="/public/media/logos/flexup-circle-color.svg">
                                        </div>
                                        <div class="d-flex flex-column">
                                            <div class="fw-bold d-flex align-items-center fs-5">
                                                {{ user.primary_individual.first_name }} {{ user.primary_individual.last_name }}
                                                <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Woah</span>
                                            </div>
                                            <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">{{ user.email }}</a>
                                            <a href="javascript:void(0);" class="fw-semibold text-muted text-hover-primary fs-9" @click="authStore.logout()">Sign Out</a>
                                        </div>
                                    </div>
                                </div>
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

const accountStore = useAccountsStore();
const authStore = useAuthStore();

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