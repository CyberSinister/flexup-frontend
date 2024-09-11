<template>
    <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <div class="d-flex flex-column flex-column-fluid">
            <div id="kt_app_content" class="app-content flex-column-fluid ">
                <div id="kt_app_content_container" class="app-container container-fluid mt-20">
                    <div class="row mt-10">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="d-flex align-items-center">
                                <i class="ki-duotone ki-user-tick fs-2x text-dark">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                                <h1 class="fs-2 fw-bolder ms-3 mb-0">Account Information</h1>
                            </div>
                            <div class="d-flex">
                                <button type="button" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm btn-circle" @click="toggleEditMode">
                                    <i class="ki-duotone ki-notepad-edit fs-3x">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="my-15">
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group mb-4 fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Presence:</label>
                                        <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.presence.specific_details.show = !helpTexts.presence.specific_details.show">{{ helpTexts.presence.specific_details.show?'Hide details':'Show details' }}</a></span>
                                    </div>
                                    <el-select v-model="currentAccount.presence" name="currentAccount.presence" id="presence" disabled>
                                        <el-option value="ON" :selected="currentAccount.presence=='ON'" label="🌐 Online"></el-option>
                                        <el-option value="OF" :selected="currentAccount.presence=='OF'" label="📍 Offline"></el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    <small v-if="currentAccount.presence=='ON'">This is a <strong>online</strong> account. It is actively managed and can interact with other accounts directly via the FlexUp app.</small>
                                    <small v-else-if="currentAccount.presence=='OF'">This is a <strong>offline</strong> account. It used for internal book-keeping only. It is visible only to the current account that created it.</small>
                                </div>
                            </div>
                            <div class="col-lg-8" v-if="helpTexts.presence.specific_details.show">
                                <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                                    <span v-if="currentAccount.presence == 'ON'" v-html="helpTexts.presence.specific_details['ON']"></span>
                                    <span v-else-if="currentAccount.presence == 'OF'" v-html="helpTexts.presence.specific_details['OF']"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group mb-4 fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Type:</label>
                                        <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.account_type.specific_details.show = !helpTexts.account_type.specific_details.show;">{{ helpTexts.account_type.specific_details.show?'Hide details':'Show details' }}</a></span>
                                    </div>
                                    <el-select name="account_type" id="account_type" v-model="currentAccount.account_type" disabled placeholder="Please select an account type">
                                        <el-option v-if="currentAccount.presence=='ON'" value="P" label="👤 Personal"></el-option>
                                        <el-option value="B" label="💼 Business"></el-option>
                                        <el-option v-if="currentAccount.presence=='ON'" value="S" label="👥 Shared"></el-option>
                                        <el-option v-if="currentAccount.presence=='ON'" value="A" label="🚀 Sub-Account"></el-option>
                                        <el-option v-if="currentAccount.presence=='OF'" value="U" label="❓ Unspecified"></el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    <small v-if="currentAccount.account_type=='P'">This account belongs to a/an <strong>individual</strong> owner (a physical person).</small>
                                    <small v-else-if="currentAccount.account_type=='B'">This account belongs to a/an <strong>organization</strong> owner (a juridical person/legal entity such as a company, NGO, fund,...).</small>
                                    <small v-else-if="currentAccount.account_type=='S'">This account belongs to a/an <strong>grouping</strong> owner (a collection of other accounts, called "constituents").</small>
                                    <small v-else-if="currentAccount.account_type=='A'">This account belongs to a/an <strong>account</strong> owner (another account, called its "parent").</small>
                                    <small v-else-if="currentAccount.account_type=='U'">This account belongs to a/an <strong>unspecified</strong> owner (for local accounts only, the account type can remain unspecified).</small>
                                </div>
                            </div>
                            <div class="col-lg-8" v-if="helpTexts.account_type.specific_details.show">
                                <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                                    <span v-if="currentAccount.account_type == 'P'" v-html="helpTexts.account_type.specific_details['P']"></span>
                                    <span v-else-if="currentAccount.account_type == 'B'" v-html="helpTexts.account_type.specific_details['B']"></span>
                                    <span v-else-if="currentAccount.account_type == 'S'" v-html="helpTexts.account_type.specific_details['S']"></span>
                                    <span v-else-if="currentAccount.account_type == 'A'" v-html="helpTexts.account_type.specific_details['A']"></span>
                                    <span v-else-if="currentAccount.account_type == 'U'" v-html="helpTexts.account_type.specific_details['U']"></span>
                                </div>
                            </div>
                        </div>
                        <div v-if="currentAccount.presence=='ON'" class="row">
                            <div class="col-12">
                                <p class="text-muted fw-semibold mb-0">Who should be able to see this account? What is the account visibility?</p>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group mb-4 fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Visibility:</label>
                                        <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.account_visibility.show = !helpTexts.account_visibility.show">{{ helpTexts.account_visibility.show?'Hide details':'Show details' }}</a></span>
                                    </div>
                                    <el-select v-model="currentAccount.visibility" :disabled="!editMode">
                                        <el-option value="PB" :selected="currentAccount.visibility=='PB'" label="📢 Public"></el-option>
                                        <el-option value="PR" :selected="currentAccount.visibility=='PR'" label="🔒 Private"></el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    <small v-if="currentAccount.visibility=='PB'">This account is <strong>public</strong>, and is therefore visible in the FlexUp public account directory, allowing other users to find you (for example to pace an order).</small>
                                    <small v-else-if="currentAccount.visibility=='PR'">This account is <strong>private</strong>, and is <u>not</u> visible in the FlexUp <strong>public account directory</strong>. Other accounts can only see you (for example to place an order) if you are in <u>their</u> <strong>third-party directory</strong> (for example if you placed an order with them in the past).</small>
                                </div>
                            </div>
                            <div class="col-lg-8" v-if="helpTexts.account_visibility.show">
                                <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                                    <span v-html="helpTexts.account_visibility.text"></span>
                                </div>
                            </div>
                        </div>
                        <div v-if="currentAccount.account_type=='P'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h3 class="text-info fw-semibold mb-0">Individual Profile</h3>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this individual:</p>
                                <div class="row" v-if="currentAccount.owner_individual">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">First Name:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.first_name" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Last Name:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.last_name" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Email Address:</label>
                                                <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.email.show = !helpTexts.email.show">{{ helpTexts.email.show?'Hide details':'Show details' }}</a></span>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.email" disabled/>
                                            <div class="p-5 bg-light-warning rounded" v-if="helpTexts.email.show">
                                                <span v-html="helpTexts.email.text"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Mobile Number:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.mobile_number" disabled/>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 mb-4">
                                            <div class="form-group fv-row">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <label class="form-label fs-6 fw-semibold required">Date of Birth:</label>
                                                </div>
                                                <el-date-picker v-model="currentAccount.owner_individual.date_of_birth" value-format="YYYY-MM-DD" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold">Residence Country:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.residence_country" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold">Residence Address:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_individual.residence_address" disabled/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="currentAccount.account_type=='B'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h3 class="text-info fw-semibold mb-0">Organization Profile</h3>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>organization</strong>:</p>
                                <div class="row" v-if="currentAccount.owner_organization">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Legal Name:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_organization.legal_name" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Legal Form:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_organization.legal_form" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Registration Date:</label>
                                            </div>
                                            <el-date-picker v-model="currentAccount.owner_organization.registration_date" value-format="YYYY-MM-DD" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Registration Number:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_organization.registration_number" disabled/>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 mb-4">
                                            <div class="form-group fv-row">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <label class="form-label fs-6 fw-semibold required">Registration City:</label>
                                                </div>
                                                <el-input v-model="currentAccount.owner_organization.registration_city" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Registration Country:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_organization.registration_country" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Registration Address:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_organization.registered_address" disabled/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="currentAccount.account_type=='S'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h3 class="text-info fw-semibold mb-0">Grouping Profile</h3>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>grouping</strong>:</p>
                                <div class="row" v-if="currentAccount.owner_grouping">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Name:</label>
                                            </div>
                                            <el-input v-model="currentAccount.owner_grouping.name" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Start Date:</label>
                                            </div>
                                            <el-date-picker v-model="currentAccount.owner_grouping.start_date" value-format="YYYY-MM-DD" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-4">
                                        <div class="form-group">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Scope:</label>
                                            </div>
                                            <el-input
                                                v-model="currentAccount.owner_grouping.scope"
                                                style="width: 240px"
                                                autosize
                                                type="textarea"
                                                placeholder="Describe what this grouping is about"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="currentAccount.account_type=='A'" class="row mt-5">
                            <div class="col-12 bg-light-info border border-info p-10 rounded border-dashed">
                                <h3 class="text-info fw-semibold mb-0">Subaccount Profile</h3>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>subaccount</strong>, and differentiate it from the other activities of its parent account:</p>
                                <div class="row">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Subaccount Name:</label>
                                            </div>
                                            <el-input v-model="currentAccount.account_name" disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Parent Account:</label>
                                            </div>
                                            <el-select name="owner_account" id="owner_account" v-model="currentAccount.owner_account" disabled filterable placeholder="Select an account you have access to">
                                                <el-option v-for="(account, account_id) in accounts" :value="account.id" :selected="currentAccount.owner_account == account.id" placeholder="You may select any account that you're a member of" :label="account.account_name">{{ account.account_name }}</el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold required">Scope:</label>
                                            </div>
                                            <el-input v-model="currentAccount.scope" type="textarea" autosize disabled/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="p-5 bg-light-warning rounded">
                                            In order to differentiate the activities of this subaccount with those of its parent account, it is necessary to describe preciserly this subaccount's perimeter (activites included, activities excluded, etc.).
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="row">
                            <div class="col-lg-6 mb-4">
                                <div class="form-group fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Account Name:</label>
                                    </div>
                                    <el-input v-model="currentAccount.account_name" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <span class="d-flex align-items-center">
                                    <strong class="text-nowrap me-3 fs-3">
                                        <u>Account Settings</u>
                                    </strong>
                                    <span class="separator my-15 w-100 border-dark"></span>
                                </span>
                            </div>
                            <div class="col-12">
                                <div class="form-group mb-4">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Image:</label>
                                    </div>
                                    <div class="symbol symbol-100px symbol-circle" for="account_image">
                                        <label class="symbol-label cursor-pointer" :style="{ backgroundImage: `url(${computedImageUrl})`} ">
                                            <input ref="imageFieldCurrent" type="file" name="account_image" id="account_image" class="d-none" accept=".png, .jpg, .jpeg" @change="onFileChangeCurrent" :disabled="!editMode" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 mb-4">
                                <div class="form-group fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label fs-6 fw-semibold required">Account Country:</label>
                                        <el-popover placement="top" :width="400" trigger="click">
                                            <template #reference>
                                                <i class="ki-duotone ki-information-4 fs-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                </i>
                                            </template>
                                            <div v-html="helpTexts.account_country.text"></div>
                                        </el-popover>
                                    </div>
                                    <el-select placeholder="Country" filterable style="background-color: #f4f4f4f4 !important;" v-model="currentAccount.country" :disabled="!editMode" @change="selectDefaultCurrency">
                                        <el-option v-for="(obj, _country) in countries" :value="_country" :selected="_country == currentAccount.country" :label="obj.name_long">{{ obj.name_long }}</el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 mb-4">
                                <div class="form-group">
                                    <div class="d-flex w-100 justify-content-between align-items-center">
                                        <label class="form-label fs-6 fw-semibold required">Account Currency:</label>
                                        <el-popover placement="top" :width="400" trigger="click">
                                            <template #reference>
                                                <i class="ki-duotone ki-information-4 fs-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                </i>
                                            </template>
                                            <div v-html="helpTexts.account_currency.text"></div>
                                        </el-popover>
                                    </div>
                                    <el-select placeholder="Currency" style="background-color: #f4f4f4f4 !important;" :disabled="!editMode" v-model="currentAccount.currency">
                                        <el-option v-for="(obj, _currency) in currencies" :value="_currency" :selected="_currency == currentAccount.currency" :label="`${obj.symbol} ${obj.long_name}`">{{ obj.symbol }} {{ obj.long_name }}</el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="editMode" class="row">
                        <div class="col-auto">
                            <el-button v-if="!updatingAccount" type="success" @click="updateAccount">Update Account</el-button>
                            <el-button v-else type="success" loading disabled>Updating Account, please wait...</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, watch, computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useAccountsStore } from "@/stores/accounts";
import { useOptionsetStore } from "@/stores/optionsets";
import ApiService from "@/core/services/ApiService";
import { processErrors, convertToFormData } from "@/core/helpers/processing";
import Swal from "sweetalert2";
import { ElMessage } from 'element-plus'
import * as Yup from 'yup';

export default defineComponent({
    name: "AccountIndex",

    setup() {
        const route = useRoute();
        const authStore = useAuthStore();
        const accountStore = useAccountsStore();
        const optionsetStore = useOptionsetStore();
        const newAccountFormVisible = ref(false);
        const errors = ref('');
        const errorsRead = ref(true);
        const isLoading = ref(false);
        const updatingAccount = ref(false);

        const selectedVisibility = computed(() => {
            return newAccountForm.account_type === 'P' ? 'PR' : 'PB';
        });    
        
        
        const editMode = ref(false);
        const baseUrl = ApiService.getBaseUrl();
        
        const computedImageUrl = computed(() => {
            const image = currentAccount.value.image;
            // if (image) {
            //     if (image.startsWith('data:')) {
            //         return image;
            //     } else {
            //         return baseUrl + image;
            //     }
            if (image) {
                return image;
            } else {
                return `${baseUrl}/static/img/image-placeholder.svg`;
            }
        });
        const imageFieldCurrent = ref(null);
		const onFileChangeCurrent = (e) => {
            const file = e.target.files[0];
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (e.target) {
                    currentAccount.value.image = e.target.result as string;
                }
            };
            
            reader.readAsDataURL(file);
		};

        const currentAccount = computed(() => accountStore.currentAccount);

        const accounts = computed(() => accountStore.accounts);
        

        const countries = optionsetStore.getCountries();
        const currencies = optionsetStore.getCurrencies();
        
        const selectDefaultCurrency = () => {
			if (currentAccount.value.country) {
				const selectedCountry = countries[currentAccount.value.country];
				console.log(selectedCountry)
				if (selectedCountry) {
					currentAccount.value.currency = selectedCountry.currency;
				}
			}
		}

        const updateAccount = async () => {
            updatingAccount.value = true;
            const formData = new FormData();

            if (imageFieldCurrent.value.files.length>0) {
                formData.append('image', imageFieldCurrent.value.files[0]);
            }

            if (!currentAccount.value.currency) {
                Swal.fire({
                    icon: 'error',
                    title: 'Currency is required!',
                    text: 'Please select a currency for this account before proceeding.',
                })
                updatingAccount.value = false;
                return
            } else {
                formData.append('currency', currentAccount.value.currency);
            }

            if (!currentAccount.value.country) {
                Swal.fire({
                    icon: 'error',
                    title: 'Country is required!',
                    text: 'Please select a country for this account before proceeding.',
                })
                updatingAccount.value = false;
                return
            } else {
                formData.append('country', currentAccount.value.country);
            }

            if (!currentAccount.value.visibility) {
                Swal.fire({
                    icon: 'error',
                    title: 'Visibility is required!',
                    text: 'Please select a visibility for this account before proceeding.',
                })
                updatingAccount.value = false;
                return
            } else {
                formData.append('visibility', currentAccount.value.visibility);
            }

            ApiService.multipartPut(`/api/v2/accounts/accounts/${currentAccount.value.id}/`, formData).then((response) => {
                ElMessage({
                    message: 'Account updated successfully',
                    type: 'success'
                })
                console.log('response data: ', response.data)
                accountStore.updateAccount(response.data);
                accountStore.currentAccount.value = response.data;
                updatingAccount.value = false;
            }).catch((error) => {
                if (error.response.status && error.response.status == 400) {
                    const _errors = processErrors(error.response.data);
                    Swal.fire({
                        icon: 'error',
                        title:  "An error occured while updating account!",
                        html: _errors,
                    })
                } else {
                    console.log('The following error has occured: ', error)
                }
                updatingAccount.value = false;
            });
        }

        const toggleEditMode = () => {
            editMode.value = !editMode.value;
            ElMessage({
                message: `Edit mode is now ${editMode.value ? 'enabled' : 'disabled'}`,
                type: editMode.value?'info':'warning'
            })
        }

        const helpTexts = reactive({
            'presence': {
                text: `<p><strong>Presence</strong> determines how an account is managed, and if it can interact with other accounts via the FlexUp app. The options are:</p>
                🌐 Online: To actively engage and interact with other accounts across the FlexUp platform. This account is actively managed by on or more members, it is visible by other accounts in the FlexUp platform and you can manage make transactions with them directly via the FlexUp platform.
                <br>
                📍 Offline: For managing transactions solely within this current account. It's intended for internal bookkeeping. This account is not actively managed, it is not visible by other accounts in the FlexUp platform and cannot interact with them.
                `, show: false,
                specific_details: {
                    show: false,
                    'ON': `
                    <p><strong>A online account</strong> is actively managed by one or more members (registered users) and is registered in the FlexUp <strong>public accounts directory</strong>.</p>
                    <ul>
                        <li>You can create an online account for someone or something that will use it to manage its own activity and interact with other accounts via the FlexUp app.</li>
                        <li>All transactions (contracts, orders, payments) with a online account are jointly managed with them via the FlexUp app.</li>
                        <li>Any transaction that you create or modify, from your own account interface, with a third-party online account, will also be seen by them in their own account interface.</li>
                        <li>
                            This means that you both see the same transaction in your respective accounts.
                            <ul><li>For example, you can create and send an order to a third-party online account, and they will see the order pop up in their account interface and can then accept or reject it.</li></ul>
                        </li>
                        <li>
                            In most cases, you cannot unilaterally change a transaction (modify its content or change it status) with a third-party online account but you must send/submit them via the FlexUp app for their review and approval.
                            <ul><li>For example, you cannot mark an order as "Confirmed". But you can send the order to the third-party and wait for it to accept it. Once accepted, the order status is then updated by the system to "Confirmed".</li></ul>
                        </li>
                        <li>A global account should have at least 1 member.</li>
                        <li>
                            When you create an online account:
                            <ul>
                                <li>You are automatically a member of this account with an "Admin 🔑" role, and this account will appear in the list of accounts that you are a member of ("My memberships").</li>
                                <li>You must confirm that you are <u>duly authorised</u> to create this account on behalf of its owner(s)..</li>
                                <li>Once the account is created, you can then invite other members.</li>
                            </ul>
                        </li>
                    </ul>
                    `,
                    'OF': `
                    <p>An <strong>offline account</strong> is an account that is not actively managed in the FlexUp app and has no <strong>members</strong>.</p>
                    <ul>
                        <li>
                            You can create a offline account for a <strong>third-party</strong> that:
                            <ul>
                                <li>does not have a FlexUp account, or</li>
                                <li>that you do not wish to interact with via the FlexUp app.</li>
                            </ul>
                        </li>
                        <li>You can create a offline account to register transactions with this third-party, but this third-party account, and all the transactions that you register with it in the system, will only be visible to you in your current account interface.</li>
                        <li>You can freely change content and the <strong>status</strong> of all transactions with a local third-party account (for example, you can mark an order as "Confirmed").</li>
                        <li>
                            Offline accounts are convenient to register transactions with third-parties that don't use the system, or for third-parties whose transactions you don't need to manage individually.
                            <ul><li>For example, you can create a offline third-party named "Other suppliers" to group all miscellaneous orders and payments with various suppliers.</li></ul>
                        </li>
                        <li>
                            In most cases, you cannot unilaterally change a transaction (modify its content or change it status) with a third-party online account but you must send/submit them via the FlexUp app for their review and approval.
                            <ul><li>For example, you cannot mark an order as "Confirmed". But you can send the order to the third-party and wait for it to accept it. Once accepted, the order status is then updated by the system to "Confirmed".</li></ul>
                        </li>
                    </ul>
                    `
                }
            },
            'account_type': {
                'text': `
                <p>The available accounts types are:</p>
                <p class="mb-0"><strong>- 👤 personal:</strong> represents an individual 🧑‍💻(ie. physical person),</p>
                <p class="mb-0"><strong>- 💼 business:</strong> represents an organization 🏢 (ie. juridical person, legal entity),</p>
                <p class="mb-0"><strong>- 👥 shared:</strong> represents a grouping 👪 (ie. a collection of multiple accounts),</p>
                <p class="mb-0"><strong>- 🚀 subaccount:</strong> a sub-permiter of the parent account's activities,</p>
                <p class="mb-0"><strong>- ❓ unspecified:</strong> select this if you are not sure.</p>
                <br>
                <p>Restrictions:</p>
                <p class="mb-0"><strong>- local accounts:</strong> only business and unspecified are available,</p>
                <p class="mb-0"><strong>- global accounts:</strong> unspecified is not available.</p>
                `, show: false,
                specific_details: {
                    'P': `
                    <p>A <strong>personal account</strong> represents and belongs to an <strong>individual</strong> (i.e.: a <u>physical person</u>, whether it is a registered <strong>user</strong> or not). </p>
                    <ul>
                        <li>A user can only have one personal account (which is the user's "main" account).</li>
                    </ul>
                    <br>
                    <p>When you sign up and create your <strong>user</strong> profile, you are identified as an <strong>individual</strong> and your <strong>personal account</strong> is automatically created for you.</p>
                    <ul>
                        <li>You are automatically added as a <strong>member</strong> of this personal account with an "Admin 🔑" role.</li>
                        <li>You can then invite other users to become members of this personal account, if you need help managing or supervising it.</li>
                    </ul>
                    <br>
                    <p>If you wish to create a personal account for someone else:</p>
                    <ul>
                        <li>you must be duly authorised by this person do so,</li>
                        <li>you will automatically added as a member of this personal account with an "Admin 🔑" role,</li>
                        <li>you must invite this person to become a member of this account with an "Admin 🔑" role (unless specific circumstances prevent this person from accessing the system).</li>
                    </ul>
                    `,
                    'B': `
                    <p>A <strong>business account</strong> represents and belongs to an <strong>organization</strong>.</p>
                    <ul>
                        <li>An organization is a juridical person: an entity which has a legal personality and is duly registered, such as a company, an NGO, a registered professional or a public entity. </li>
                        <li>A user can create, edit or view a business accounts only if they have been duly authorized by this organization. </li>
                        <li>An organization can only have one business account (which is the organization's "<strong>main</strong>" account).</li>
                    </ul>
                    `,
                    'A': `
                    <p>A <strong>subaccount 🚀</strong> represents a sub-set of economic activities of its <strong>parent</strong> account.
                        <ul>
                            <li>Subaccounts are owned by their parent account's owners.</li>
                            <li>They can be used for specific projects or segments within the parent account’s activities, such as an organization’s business unit or branch, or for a personal project or hobby. </li>
                            <li>A subaccount's parent can be any type of account (including another subaccount).</li>
                        </ul>
                    </p>
                    <br>
                    <p>When you create a subaccount, it's parent is automatically the current account (the one you are currently in). 
                        <ul>
                            <li>You can only create a sub account if you have Admin rights to the current account.</li>
                            <li>If you wish to create a subaccount for another account (that you are an Admin for), please switch account via the account selector button (top right in the page's header)</li>
                        </ul>
                    </p>
                    <br>
                    <p>A subaccount does not have its own legal identity, so any transactions that you make for this subaccount is actually made by parent account's ultime owner (direct or indirect). It is important to clearly identity the subaccount's owner, because - from a legal point of view - any transactions made by this subaccount are actually made by and on behalf of its owner.</p>
                    <br>
                    <p>The identity of the subaccount's owner is defined by identify the parent account (of which this subaccount is a child).</p>
                    <p>The subaccount' parent can be any type of account:
                        <ul>
                            <li>- a <strong>personal account</strong> 👤: if the owner is an <strong>individual🧑‍💻</strong> (ie. physical person, where a registered user  or not),</li>
                            <li>- a <strong>business account 💼</strong>: if its owner is an <strong>organisation</strong> 🏢 (ie. a legal entity),</li>
                            <li>- a <strong>shared account 👥</strong>: if its owner is a <strong>grouping</strong> 👪 (ie. a collection of multiple accounts),</li>
                            <li>- <strong>another subaccount 🚀</strong>: in this case, the owner can be determined indirectly by looking up this other subaccount's owner.</li>
                        </ul>
                    </p>
                    `,
                    'S': `
                    <p>A shared account this represents and belongs to a grouping. 
                        <ul>
                            <li>A grouping is a contractually defined partnership between a collection of "constituents" that jointly own this account.</li>
                            <li>A grouping does not have a legal personality (it is neither a physical person nor a juridical person).</li>
                            <li>Each constituent is represented by an account, which can be of any type.</li>
                            <li>Shared accounts are co-owned by their constituents' respective owners.</li>
                            <li>They can be used for collective projects or activities involving multiple participants, but for which no one is taking a leading role as the project’s sole owner.</li>
                            <li>A grouping can only have one shared account (which is the grouping's "main" account).</li>
                            <li>Any type of account can join a grouping, but they must sign all sign the grouping agreement which defines the roles and responsibilities of each constituent.</li>
                        </ul>
                    </p>
                    `,
                    'U': `<p>If the account's scope is <strong>local</strong>, the account's identity and type may be <strong>unspecified</strong>. In such as case, the owner identify is not required</p>`,
                    show: false
                }
            },
            'account_visibility': {
                'text': `
                <p>
                    <strong>Visibility</strong> determines if an <strong>account</strong> can be seen by others in the FlexUp accounts directory, it only applies to <strong>Online🌐</strong> accounts.  The options are are:
                    <ul>
                        <li><strong>Public 📢</strong>: public accounts can be directly interacted with. All their account information are visible in the FlexUp global accounts directory, making their identity clear. You can look up a public account in the global directory, check their details andsend them an order directly. Business accounts are generally public.</li>
                        <li><strong>Private 🔒</strong>: the privacy of private accounts is more protected. Only their name and type is visible in the FlexUp global accounts <strong>directory</strong>. You can only intitiate transactions with them if they have accepted a contact request. Once accepted, they will be added to your <strong>third-party directory</strong>. <strong>Personal accounts</strong> are generally private.</li>
                    </ul>
                </p>
                <p>A private personal account can direcly place and order to a public. Apublic account cannot sent an unsollicited order to a private personal account, they must either first send a contact request, or wait for the private account to send them an order.</p>
                <br>
                <p>Note that only <strong>Global 🌐</strong> accounts can be public or private. <strong>Local 📍</strong> accounts do not have any visibility, they don't exist outside the account that created it (their are used for local book-keeping only).</p>
                `, show: false,
            },
            'account_name': 'This is the name of your account. It can be your name or a nickname.',
            'account_country': {
                'text': `<span>
                    A <strong>country</strong> is required for all <strong>accounts</strong> to determine the applicable jurisdication.
                    <ul>
                        <li>The account's country should, in principal, be equal to that of their <strong>owners</strong> (<strong>users</strong>, <strong>organizations</strong> and <strong>groupings</strong>).</li>
                        <li>The account's country is used as the default value for any <strong>transactions</strong> (contract, orders, payments...) that it creates.</li>
                    </ul>
                </span>`, show: false
            },
            'account_currency': {
                'text': `<span>
                    A <strong>currency</strong> is required for all <strong>accounts</strong>:
                    <ul>
                        <li>in determines the currency used for the account's <strong>reserves</strong> (ie: to calculate the account's available cash) and <strong>allocations</strong> (transfers between reserves),</li>
                        <li>it is the currency that all commitments are converted into during the <strong>resolution</strong> processes,</li>
                        <li>it is the default currency any new thing created by this account: <strong>contract</strong>, <strong>order</strong>, <strong>wallet</strong>, etc.</li>
                    </ul>
                </span>`, show: false
            },
            'email': {
                'text': `
                <ul>
                    <li>When you create a new <strong>global</strong> personal account on behalf of someone else, you must provide their email address so that we can invite them to take control of their account.</li>
                    <li>If you do not wish to invite them, please create a local account instead.</li>
                    <li>Once an account is created, the email can no longer be changed through this form (you need to contact support).</li>
                </ul>`, show: false
            }
        });

        return {
            errors, errorsRead,
            authStore, currentAccount,
            helpTexts, accounts,
            editMode, selectDefaultCurrency,
            countries, currencies,
            newAccountFormVisible, selectedVisibility,
            isLoading, toggleEditMode,
            updateAccount, updatingAccount,
            computedImageUrl, imageFieldCurrent, onFileChangeCurrent,
        };
    },
});
</script>