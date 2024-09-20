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
                <div class="d-flex">
                    <button type="button" class="btn btn-light-primary btn-hover-primary btn-sm btn-circle ms-3">
                        Change Password
                    </button>
                    <button type="button" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm btn-circle ms-3" @click="toggleEditMode">
                        <i class="ki-duotone ki-notepad-edit fs-3x">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                    </button>
                </div>
            </div>
        </div>
        <el-form class="row my-15" ref="userForm" :model="currentUser" :rules="userFormRules">
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="first_name">
                    <label class="form-label required mb-0">First Name:</label>
                    <el-input v-model="currentUser.primary_individual.first_name" placeholder="First Name" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="last_name">
                    <label class="form-label required mb-0">Last Name:</label>
                    <el-input v-model="currentUser.primary_individual.last_name" placeholder="Last Name" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="last_name">
                    <label class="form-label required mb-0">Email Address:</label>
                    <el-input v-model="currentUser.email" placeholder="Email Address" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
        </el-form>
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

const userFormRules = reactive({});

const editMode = ref(false);

const toggleEditMode = () => {
    editMode.value = !editMode.value;
}

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