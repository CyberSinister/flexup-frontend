<template>
    <div id="kt_app_content_container" class="app-container container-fluid mt-20">
        <div class="row mt-10">
            <div class="d-flex w-100 justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-user-edit fs-2x text-dark">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                    </i>
                    <h1 class="fs-2 fw-bolder ms-3 mb-0">My User Profile</h1>
                </div>
            </div>
        </div>
        <div class="d-flex mt-15 mb-5 w-100">
        </div>
        <div class="row">
            <div class="col-12">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { ElSelect, ElOption, ElInput, ElForm, ElFormItem, ElDialog, ElButton } from 'element-plus';
import { useOptionsetStore } from '@/stores/optionsets';
import { useAuthStore } from '@/stores/auth';
import { useAccountsStore } from '@/stores/accounts';
import ApiService from '@/core/services/ApiService';
import { Loading } from '@element-plus/icons-vue';
import Swal from 'sweetalert2';
import { ElMessage } from 'element-plus'

const baseUrl = ApiService.getBaseUrl();

const accountStore = useAccountsStore();
const accounts = computed(() => accountStore.accounts);
const optionsetStore = useOptionsetStore();
const authStore = useAuthStore();

const currentAccount = computed(() => accountStore.currentAccount);
const currentUser = computed(() => authStore.getUser());

</script>

<style scoped>
.cell.highlight {
    background: none !important;
    background-color: none !important;
}

.search-input:focus {
    border-color: #5d78ff !important;
}
</style>