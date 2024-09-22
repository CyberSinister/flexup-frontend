<template>
    <div id="kt_app_content_container" class="app-container container-fluid mt-20">
        <div class="d-flex flex-column mt-10">
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
                    <button type="button" class="btn btn-light-primary btn-hover-primary btn-sm btn-circle ms-3" @click="changePasswordDialogVisible = !changePasswordDialogVisible">
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
            <div class="d-flex">
                <p class="text-muted mb-0">Here, you can update your user profile and authentication settings</p>
            </div>
        </div>
        <el-form class="row my-15" ref="userForm" :model="_currentUser" :rules="userFormRules">
            <div class="col-12">
                <h2 class="mb-0">Personal Information</h2>
                <p class="text-muted">This is your public information, accessible by other FlexUp users based on your primary account settings.</p>
            </div>
            <div class="col-12">
                <div class="form-group mb-4">
                    <div class="d-flex w-100 justify-content-between">
                        <label class="form-label required">Image:</label>
                    </div>
                    <div class="symbol symbol-100px symbol-circle" for="account_image">
                        <label class="symbol-label cursor-pointer" :style="{ backgroundImage: `url(${computedImageUrl})`} ">
                            <input ref="imageFieldCurrent" type="file" name="account_image" id="account_image" class="d-none" accept=".png, .jpg, .jpeg" @change="onFileChangeCurrent" :disabled="!editMode" />
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="primary_individual.first_name">
                    <label class="form-label required mb-0">First Name:</label>
                    <el-input v-model="_currentUser.primary_individual.first_name" placeholder="First Name" class="w-100" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="primary_individual.last_name">
                    <label class="form-label required mb-0">Last Name:</label>
                    <el-input v-model="_currentUser.primary_individual.last_name" placeholder="Last Name" class="w-100" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
            <div class="col-12">
                <div class="row">
                    <div class="col-lg-6 col-sm-12">
                        <el-form-item prop="primary_individual.date_of_birth">
                            <label class="form-label required mb-0">Date of Birth:</label>
                            <el-date-picker v-model="_currentUser.primary_individual.date_of_birth" class="w-100" value-format="YYYY-MM-DD" :disabled="!editMode"/>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="email">
                    <label class="form-label required mb-0">Email Address:</label>
                    <el-input v-model="_currentUser.primary_individual.email_address" placeholder="Email Address" class="w-100" clearable :disabled="!editMode"></el-input>
                    <span class="form-text">This is the email address used by and visible to other FlexUp users on the platform. It is separate from your authentication email below.</span>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="primary_individual.mobile_number">
                    <label class="form-label required mb-0">Mobile Number:</label>
                    <el-input v-model="_currentUser.primary_individual.mobile_number" placeholder="Mobile Number" class="w-100" clearable :disabled="!editMode"></el-input>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="primary_account.country">
                    <label class="form-label required mb-0">Country:</label>
                    <el-select placeholder="Country" class="w-100" filterable style="background-color: #f4f4f4f4 !important;" v-model="_currentUser.primary_account.country" :disabled="!editMode">
                        <el-option v-for="(obj, _country) in countries" :value="_country" :selected="_country == _currentUser.primary_account.country" :label="obj.name_long">{{ obj.name_long }}</el-option>
                    </el-select>
                    <span class="form-text">This country field reflects onto your primary account as well, change this with caution.</span>
                </el-form-item>
            </div>
            <div class="col-12 mt-5">
                <h2 class="mb-0">Authentication Settings</h2>
                <p class="text-muted">This section contains the settings/fields used for authenticating on the FlexUp platform.</p>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="email">
                    <div class="d-flex w-100 justify-content-between">
                        <label class="form-label required mb-0">Authentication Address:</label>
                        <span v-if="editMode" class="d-flex">
                            <a href="javascript:void(0)" class="text-warning text-hover-primary fw-bold" @click="toggleEmailUpdate">{{ updatingEmail?'Disable':'Enable' }}</a>
                        </span>
                    </div>
                    <el-input v-model="_currentUser.email" placeholder="Email Address" class="w-100" :disabled="!updatingEmail" clearable></el-input>
                </el-form-item>
            </div>
            <div class="col-lg-6 col-sm-12">
                <el-form-item prop="primary_individual.mobile_number">
                    <div class="d-flex w-100 justify-content-between">
                        <label class="form-label required mb-0">Username:</label>
                        <span v-if="editMode" class="d-flex">
                            <a href="javascript:void(0)" class="text-warning text-hover-primary fw-bold" @click="toggleUsernameUpdate">{{ updatingUsername?'Disable':'Enable' }}</a>
                        </span>
                    </div>
                    <el-input v-model="_currentUser.username" placeholder="Username" class="w-100" :disabled="!updatingUsername" clearable></el-input>
                </el-form-item>
            </div>
        </el-form>
        <el-dialog
            v-model="changePasswordDialogVisible"
            title="Change password"
            width="500"
            align-center
        >
            <el-form class="row" ref="_passwordChangeForm" :model="passwordChangeForm" :rules="passwordChangeFormRules">
                <div class="col-12">
                    <el-form-item prop="old_password">
                        <label class="form-label required mb-0">Current Password:</label>
                        <el-input type="password" v-model="passwordChangeForm.old_password" placeholder="Enter your current password" class="w-100" clearable></el-input>
                    </el-form-item>
                </div>
                <div class="col-12">
                    <el-form-item prop="new_password">
                        <label class="form-label required mb-0">New Password:</label>
                        <el-input type="password" v-model="passwordChangeForm.new_password" placeholder="Enter your new password" class="w-100" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <el-dialog v-model="passwordUpdateDialogVisible" title="Something's not right...">
                <div v-html="passwordUpdateErrors"></div>
            </el-dialog>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="changePasswordDialogVisible = false">Cancel</el-button>
                    <el-popconfirm
                        confirm-button-text="Yes"
                        cancel-button-text="No"
                        :icon="InfoFilled"
                        icon-color="#626AEF"
                        title="Are you sure you want to change your password?"
                        @confirm="updatePassword"
                    >
                        <template #reference>
                            <el-button type="primary" :disabled="updatingPassword">{{ updatingPassword?'Updating Password...':'Change Password' }}</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
        </el-dialog>
        <div class="row">
            <div v-if="editMode" class="col-auto">
                <el-button v-if="!updatingUser" type="success" @click="updateUser">Update Profile</el-button>
                <el-button v-else type="success" loading disabled>Updating Profile, please wait...</el-button>
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
import { processErrors, convertToFormData } from "@/core/helpers/processing";
import { InfoFilled } from '@element-plus/icons-vue'

const baseUrl = ApiService.getBaseUrl();

const accountStore = useAccountsStore();
const accounts = computed(() => accountStore.accounts);
const optionsetStore = useOptionsetStore();
const authStore = useAuthStore();

const _passwordChangeForm = ref(null);

const passwordChangeForm = reactive({
    old_password: null,
    new_password: null,
});

const passwordChangeFormRules = {
    old_password: [
        { required: true, message: 'Please enter your current password', trigger: 'blur' },
        // { min: 1, message: 'Please enter your new password', trigger: 'blur' },
    ],
    new_password: [
        { required: true, message: 'Please enter your new password', trigger: 'blur' },
        // { min: 1, message: 'Please enter your new password', trigger: 'blur' },
    ],
};

const passwordUpdateDialogVisible = ref(false);
const updatingPassword = ref(false);
const passwordUpdateErrors = ref('');

const updatePassword = async () => {
    updatingPassword.value = true;

    if (!_passwordChangeForm.value) {
        updatingPassword.value = false;
        return;
    }

    await _passwordChangeForm.value.validate((valid, fields) => {
        if (valid) {
            ApiService.patch(`/api/v2/users/change_password/`, passwordChangeForm).then((response) => {
                console.log('Response: ', response)
                ElMessage({
                    message: 'Password updated successfully',
                    type: 'success'
                })
                changePasswordDialogVisible.value = false;
                updatingPassword.value = false;
                if (_passwordChangeForm.value) _passwordChangeForm.value.resetFields();
            }).catch((error) => {
                if (error.response.status && error.response.status == 400) {
                    passwordUpdateErrors.value = processErrors(error.response.data);
                    passwordUpdateDialogVisible.value = true;
                } else {
                    console.log('The following error has occured: ', error)
                }
                updatingPassword.value = false;
            });
        } else {
            ElMessage({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `<h6 class="text-danger mb-0">There are errors in your form!</h6>Please correct these errors before you submit the data.`,
                type: 'error'
            })
            updatingPassword.value = false;
        }
    });
}

const countries = optionsetStore.getCountries();

const changePasswordDialogVisible = ref(false);

const currentAccount = computed(() => accountStore.currentAccount);
const currentUser = computed(() => authStore.getUser());
const formUser = reactive({...currentUser.value});

const updatingEmail = ref(false);
const updatingUsername = ref(false);

const toggleEmailUpdate = () => {
    if (!updatingEmail.value) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Updating your email address means whatever email address you type in will be used for authentication on the FlexUp platform.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, I understand',
        }).then((result) => {
            if (result.isConfirmed) {
                updatingEmail.value = true;
            }
        });
    } else {
        updatingEmail.value = false;
    }
}

const toggleUsernameUpdate = () => {
    if (!updatingUsername.value) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Your username is used for authentication on the FlexUp platform. Changing it will affect your ability to login.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'I understand',
        }).then((result) => {
            if (result.isConfirmed) {
                updatingUsername.value = true;
            }
        });
    } else {
        updatingUsername.value = false;
    }
}

const updatingUser = ref(false);
const _currentUser = computed(() => editMode.value? formUser : currentUser.value);

const editMode = ref(false);

const toggleEditMode = () => {
    editMode.value = !editMode.value;
}

const imageFieldCurrent = ref<null|HTMLInputElement>(null);
const currentIndividualImage = ref('');
const maxFileSize = 2 * 1024 * 1024;
const onFileChangeCurrent = (e) => {
    const file = e.target.files[0];

    if (file.size > maxFileSize) {
        Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'The selected file is too large. Please select a file that is less than 2MB in size.',
        });
        if (imageFieldCurrent.value) {
            imageFieldCurrent.value.value = '';
        }
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        if (e.target) {
            currentIndividualImage.value = e.target.result as string;
        }
    };
    
    reader.readAsDataURL(file);
};

const updateUser = async () => {
    updatingUser.value = true;
    // let _userForm = {...currentAccount.value};
    const formData = convertToFormData(formUser);
    console.log('current Account updating: ', currentAccount.value)

    if (imageFieldCurrent.value.files.length>0) {
        formData.append('image', imageFieldCurrent.value.files[0]);
    }

    ApiService.multipartPut(`/api/v2/users/user/${currentUser.value.id}/`, formData).then((response) => {
        ElMessage({
            message: 'Profile updated successfully',
            type: 'success'
        })
        console.log('response data: ', response.data)
        // accountStore.updateAccount(response.data);
        // accountStore.currentAccount = response.data;
        authStore.setUser(response.data);
        accountStore.updateField(response.data.primary_account.id, 'country', response.data.primary_account.country);
        accountStore.updateField(response.data.primary_account.id, 'account_name', response.data.primary_account.account_name);
        accountStore.updateField(response.data.primary_account.id, 'owner_individual', response.data.primary_individual);
        updatingUser.value = false;
        editMode.value = false;
        accountStore.fetchAccounts(true);
    }).catch((error) => {
        if (error.response.status && error.response.status == 400) {
            const _errors = processErrors(error.response.data);
            Swal.fire({
                icon: 'error',
                title:  "An error occured while updating profile!",
                html: _errors,
            })
        } else {
            console.log('The following error has occured: ', error)
        }
        updatingUser.value = false;
    });
}

const computedImageUrl = computed(() => {
    if (editMode.value && currentIndividualImage.value) {
        return currentIndividualImage.value;
    }
    const image = currentUser.value.primary_individual.image;
    // if (image) {
    //     if (image.startsWith('data:')) {
    //         return image;
    //     } else {
    //         return baseUrl + image;
    //     }
    if (image) {
        if (image.includes('http')) {
            return image;
        } else {
            return `${baseUrl}${image}`;
        }
    } else {
        return `${baseUrl}/static/img/image-placeholder.svg`;
    }
});

</script>

<style scoped>
.cell.highlight {
    background: none !important;
    background-color: none !important;
}

.search-input:focus {
    border-color: #5d78ff !important;
}

.form-text {
    line-height: 1 !important;
}
</style>