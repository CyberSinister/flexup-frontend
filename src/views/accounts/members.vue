<template>
    <div id="kt_app_content_container" class="app-container container-fluid mt-20">
        <div class="d-flex flex-column mt-10">
            <div class="d-flex w-100 justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-profile-user fs-2x text-dark">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                    </i>
                    <h1 class="fs-2 fw-bolder ms-3 mb-0">Members</h1>
                </div>
                <div v-if="currentMembership.role == 'A'" class="d-flex">
                    <button type="button" class="btn btn-light-primary btn-hover-primary btn-sm btn-circle ms-3" @click="addUsersDialog = true">
                        Add a new member
                    </button>
                </div>
            </div>
            <div class="d-flex">
                <p class="text-muted mb-0">Here, you can manage all the FlexUp user that have access to and can manage this account</p>
            </div>
        </div>
        <!-- 
        1. Should be able to add a new member to the account by seraching their email
            - add user
            - click button on top right
            - open dialog (ElDialog)
            - search users by email

        2. Should be able to change user status (sends API request to AccountMember API)

        -->
        <div class="row mt-10">
            <div v-for="(member, member_id) in currentAccount.members" class="col-lg-4 col-md-6 col-sm-12 mb-4 p-4">
                <div 
                    class="card shadow-sm" :class="{'shadow-sm bg-light-info border border-info': member.user.id == currentUser.id}">
                    <div class="card-body"
                        v-loading="member.isLoading"
                        element-loading-text="Updating Member..."
                        element-loading-background="rgba(122, 122, 122, 0.8)"
                    >
                        <div class="d-flex align-items-center" style="min-width: 0;">
                            <div class="symbol symbol-50px symbol-circle shadow-sm border me-5">
                                <img alt="Logo" :src="member.primary_individual.image?(member.primary_individual.image.includes('http')?member.primary_individual.image:baseUrl+member.primary_individual.image):'/public/media/logos/flexup-circle-color.svg'">
                            </div>
                            <div class="d-flex flex-column" style="min-width: 0;">
                                <el-tooltip :content="`${member.primary_individual.first_name} ${member.primary_individual.last_name}`">
                                    <h5 class="mb-0 d-block text-truncate">{{ member.primary_individual.first_name }} {{ member.primary_individual.last_name }}</h5>
                                </el-tooltip>
                                <el-tooltip :content="member.primary_individual.email_address">
                                    <small class="text-muted d-block text-truncate">{{ member.primary_individual.email_address }}</small>
                                </el-tooltip>
                                <div class="d-block">
                                    <span class="badge badge-pill badge-light-info">{{ getAccountRole(member.role) }}</span>
                                    <span v-if="member.user.id == currentUser.id" class="badge badge-pill badge-light-primary ms-3">Me</span>
                                    <template v-else>
                                        <span v-if="currentMembership.role == 'A' && member.role != 'A' && !(currentAccount.account_type == 'P' && currentAccount.owner_individual == member.user.primary_individual)" class="badge badge-pill ms-3 cursor-pointer" :class="{'badge-light-warning': !member.updateRole, 'badge-muted': member.updateRole}" @click="member.updateRole = member.updateRole==undefined?true:!member.updateRole">{{ member.updateRole?'Updating':'Update Role' }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div v-if="member.updateRole">
                            <div class="d-flex flex-column mt-5">
                                <div class="form-group w-100">
                                    <el-select v-model="member.role" placeholder="Select a role for this user" class="w-100" @change="updateMember(member.user.id, member.role)">
                                        <el-option label="Viewer" value="V" />
                                        <el-option label="Editor" value="E" />
                                    </el-select>
                                </div>
                                <el-button type="danger" size="small" class="mt-3" @click="removeMember(member.id)">Remove</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="addUsersDialog" title="Add users" width="800">
            <div v-if="errorsRead" class="row">
                <div class="col-12 mb-4">
                    <el-input v-model="searchByEmail" placeholder="Enter an email address to start searching" class="search-input" />
                </div>

                <div v-if="searchingUsers" class="col-12">
                    <div class="card bg-light-info">
                        <div class="card-body text-center text-info">
                            <h3 class="text-info">Searching users...</h3>
                        </div>
                    </div>
                </div>
                <template v-else-if="searchedUsers.length > 0" >
                    <div class="col-12" v-for="(user, index) in searchedUsers">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between" style="min-width: 0;">
                                    <div class="d-flex align-items-center">
                                        <div class="symbol symbol-50px symbol-circle shadow-sm border me-5">
                                            <img alt="Logo" :src="user.primary_individual.image?(user.primary_individual.image.includes('http')?user.primary_individual.image:baseUrl+user.primary_individual.image):'/public/media/logos/flexup-circle-color.svg'">
                                        </div>
                                        <div class="d-flex flex-column">
                                            <h5 class="mb-0">{{ user.primary_individual.first_name }} {{ user.primary_individual.last_name }}</h5>
                                            <small class="text-muted d-block text-truncate">{{ user.primary_individual.email_address }}</small>
                                            <el-tooltip content="An active badge means this user is allowed to perform basic operations on the FlexUp platform.">
                                                <div class="d-block">
                                                    <span class="badge badge-pill badge-light-info">{{ getAccountStatus(user.primary_account.status) }}</span>
                                                </div>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div v-if="!(currentAccount.members.find(_member => _member.user.id == user.id ))" class="d-flex">
                                        <div class="form-group">
                                            <label for="" class="form-label required mb-0">
                                                Select their role:
                                            </label>
                                            <el-select v-model="invitationRole" placeholder="Select a role for this user">
                                                <el-option label="Viewer" value="V" />
                                                <el-option label="Editor" value="E" />
                                                <el-option label="Admin" value="A" />
                                            </el-select>
                                        </div>
                                    </div>
                                    <div v-else class="d-flex">
                                        <div class="d-block">
                                            <span class="badge badge-pill badge-light-info">{{ getAccountRole(currentAccount.members.find(_member => _member.user.id == user.id ).role) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else class="col-12">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3 class="text-muted">No users found</h3>
                            <p class="text-muted">Please type in a correct FlexUp registered email address to search users to add to this account.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="row">
                <div class="col-12">
                    <h2 class="text-danger">An error has occured:</h2>
                    <div v-html="errors"></div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <template v-if="errorsRead">
                        <el-button @click="dismissAddUserForm">Cancel</el-button>
                        <el-button type="primary" v-if="searchedUsers.length > 0 && invitationRole != null && !serachedUserIsMember" :disabled="updatingMember" @click="addUserToAccount">{{ updatingMember?'Adding user to account...':'Add user to account' }}</el-button>
                    </template>
                    <template v-else>
                        <el-button type="warning" @click="errorsRead = true;">I understand</el-button>
                    </template>
                </div>
            </template>
        </el-dialog>
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
import { processErrors, convertToFormData, debounce } from "@/core/helpers/processing";
import { accountStatusMapping, accountRoleMapping } from '@/stores/accounts';

const baseUrl = ApiService.getBaseUrl();

const accountStore = useAccountsStore();
const accounts = computed(() => accountStore.accounts);
const optionsetStore = useOptionsetStore();
const authStore = useAuthStore();

const currentAccount = computed(() => accountStore.currentAccount);
const currentUser = computed(() => authStore.getUser());
const currentMembership = computed(() => Object.keys(currentAccount.value).length>0?currentAccount.value.members.find(member => member.user.id == currentUser.value.id):{role: 'V'});

const addUsersDialog = ref(false);
const search = ref('');
const editMode = ref(false);
const searchByEmail = ref('');

const invitationRole = ref(null);


onMounted(() => {
    accountStore.fetchAccounts();
});

const getAccountRole = (accountRole: string) => {
    return accountRoleMapping[accountRole];
}

const getAccountStatus = (accountStatus: string) => {
    return accountStatusMapping[accountStatus];
}

const updatingMember = ref(false);
const errors = ref('');
const errorsRead = ref(true);

const searchingUsers = ref(false);
const searchedUsers = ref([]);

const serachedUserIsMember = computed(() => {
    return searchedUsers.value.length > 0 && currentAccount.members.find(_member => _member.user.id == searchedUsers.value[0].id );
});

const addUserToAccount = () => {
    updatingMember.value = true;
    const selectedUserId = searchedUsers.value[0].id;
    const invitationRoleValue = invitationRole.value;
    const currentAccountId = currentAccount.value.id;

    if (!selectedUserId || !invitationRoleValue || !currentAccountId) {
        console.log('Selected User ID: ', selectedUserId);
        console.log('Invitation Role: ', invitationRoleValue);
        console.log('Current Account ID: ', currentAccountId);
        ElMessage.error('Please select a user and a role to add to this account');
        updatingMember.value = false;
        return;
    }

    ApiService.post(`/api/v2/accounts/accountmembers/`, {
        account_id: currentAccountId,
        user_id: selectedUserId,
        role: invitationRoleValue
    }).then((response) => {
        updatingMember.value = false;
        console.log('Response Data: ', response.data)
        accountStore.fetchAccounts();
        ElMessage.success('User added to account successfully');
        dismissAddUserForm();
    }).catch((error) => {
        console.log('Submission Error: ', error)
        if (error.response.status && error.response.status == 400) {
            errors.value = processErrors(error.response.data);
            errorsRead.value = false;
        } else {
            console.log('The following error has occured: ', error)
        }
        updatingMember.value = false;
        ElMessage.error('Error adding user to account');
        console.error('Error adding user to account:', error);
    });
    
}

const updateMember = (userId, role) => {
    updatingMember.value = true;
    const currentAccountId = currentAccount.value.id;
    currentAccount.value.members.find(member => member.user.id == userId).isLoading = true;

    ApiService.post(`/api/v2/accounts/accountmembers/`, {
        account_id: currentAccountId,
        user_id: userId,
        role: role
    }).then((response) => {
        updatingMember.value = false;
        console.log('Response Data: ', response.data)
        accountStore.fetchAccounts(true);
        currentAccount.value.members.find(member => member.user.id == userId).updateRole = false;
        currentAccount.value.members.find(member => member.user.id == userId).isLoading = false;

        ElMessage.success('User role updated successfully');
    }).catch((error) => {
        console.log('Submission Error: ', error)
        if (error.response.status && error.response.status == 400) {
            errors.value = processErrors(error.response.data);
            errorsRead.value = false;
        } else {
            console.log('The following error has occured: ', error)
        }
        updatingMember.value = false;
        ElMessage.error('Error adding user to account');
        console.error('Error adding user to account:', error);
    });
    
}

const removeMember = (memberId) => {
    updatingMember.value = true;
    let _member = currentAccount.value.members.find(member => member.id == memberId);
    if (!_member) {
        ElMessage.error('Error removing user from account');
        return;
    }

    _member.isLoading = true;

    ApiService.delete(`/api/v2/accounts/accountmembers/${memberId}`).then((response) => {
        updatingMember.value = false;
        console.log('Response Data: ', response.data)
        currentAccount.value.members = currentAccount.value.members.filter(member => member.id != memberId);
        accountStore.fetchAccounts(true);

        ElMessage.success('User role updated successfully');
    }).catch((error) => {
        console.log('Submission Error: ', error)
        if (error.response && error.response.data && error.response.data.error) {
            ElMessage.error(error.response.data.error);
        }
        _member.isLoading = false;
        ElMessage.error('Error removing user from account');
    });   
}

const dismissAddUserForm = () => {
    addUsersDialog.value = false;
    searchByEmail.value = '';
    searchedUsers.value = [];
    invitationRole.value = null;
}

const fetchUsers = debounce(async () => {
    invitationRole.value = null;
    try {
        console.log("searchByEmail",searchByEmail.value);
        searchingUsers.value = true;
        const response = await ApiService.query(`/api/v2/users/user?email=${searchByEmail.value}`, {});
        searchingUsers.value = false;
        console.log("check this work ?",response.data);
        searchedUsers.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}, 500);

watch(searchByEmail, (value) => {
    fetchUsers();
});
// ApiService.get
// ApiServer.query


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