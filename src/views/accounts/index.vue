<template>
    <div id="kt_app_content_container" class="app-container container-fluid mt-20">
        <div class="row mt-10">
            <div class="d-flex w-100 justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-people fs-2x text-dark">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                    </i>
                    <h1 class="ms-3 mb-0">Related Accounts</h1>
                </div>
                <div class="d-flex">
                    <button class="btn btn-success ms-3 btn-sm rounded" @click="newAccountFormVisible = true">New Account</button>
                </div>
            </div>
        </div>
        <div class="d-flex mt-15 mb-5 w-100">
            <el-form data-kt-search-element="form" class="d-none w-100 d-lg-block position-relative mb-5 mb-lg-0" autocomplete="off">
                <i class="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-5"></i>
                <input type="text" v-model="search"
                    class="search-input form-control form-control border h-lg-45px ps-13"
                    name="search" placeholder="Search..." data-kt-search-element="input">
                <span class="search-spinner position-absolute top-50 end-0 translate-middle-y lh-0 me-5 d-none" data-kt-search-element="spinner">
                    <span class="spinner-border h-15px w-15px align-middle text-gray-500"></span>
                </span>
                <span class="search-reset btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4 d-none" data-kt-search-element="clear">
                    <i class="ki-outline ki-cross fs-2 fs-lg-1 me-0"></i>
                </span>
            </el-form>
        </div>
        <div class="row">
            <div class="col-12">
                <el-table ref="accountsTable" :data="filterTableData" :border=true style="width: 100%" class="rounded">
                    <el-table-column type="expand">
                        <template #default="props">
                            <div class="mx-8 my-5">
                                <div class="d-flex w-100 mb-0">
                                    <strong class="mb-0 fw-semibold">Country:</strong>
                                    <span class="ms-4">{{ countries[props.row.country].name_long }}</span>
                                </div>
                                <div class="d-flex w-100 mb-0">
                                    <strong class="mb-0 fw-semibold">Currency:</strong>
                                    <span class="ms-4">{{ `${currencies[props.row.currency].symbol} ${currencies[props.row.currency].long_name}` }}</span>
                                </div>
                                <div class="d-flex w-100 mb-0">
                                    <strong class="mb-0 fw-semibold">Creator Account:</strong>
                                    <span class="ms-4"><el-tooltip placement="top" :content="`${!props.row.is_system_created?getAccountType(props.row.creator_member.account.account_type)[0]:getAccountType(props.row.account_type)[0]} Account`">{{ !props.row.is_system_created?getAccountType(props.row.creator_member.account.account_type)[1]:`${getAccountType(props.row.account_type)[1]}` }}</el-tooltip> {{ !props.row.is_system_created?props.row.creator_member.account.account_name:props.row.account_name + ' - Personal Account (System Created)' }}</span>
                                </div>
                                <div class="d-flex w-100 mb-4">
                                    <strong class="mb-0 fw-semibold">Creator User:</strong>
                                    <span class="ms-4">{{ !props.row.is_system_created?`[${props.row.creator_member.user.username}] ${props.row.creator_member.user.email}`:props.row.owner_individual.email_address }}</span>
                                </div>
                            </div>
                            <div class="mx-8 mb-5 pe-lg-">
                                <el-tabs type="border-card" class="rounded">
                                    <el-tab-pane label="Shared Accounts">
                                        <div class="px-3">
                                            <div class="d-flex w-100 mb-5">
                                                <strong class="mb-0 fw-semibold">Shared Accounts:</strong>
                                                <el-tooltip :content="`This account has ${props.row.shared_accounts.length} ${props.row.shared_accounts.length==1?'shared-account':'shared-accounts'} (i.e. is a member of groupings)`" placement="top">
                                                    <div class="badge badge-pill badge-primary ms-5">{{ props.row.shared_accounts.length}} {{ props.row.shared_accounts.length==1?'shared-account':'shared-accounts' }}</div>
                                                </el-tooltip>
                                                <el-tooltip content="Load shared account(s) details" placement="top">
                                                    <el-button size="small" type="primary" :icon="Loading" class="ms-3" :disabled="loadingHierarchy" @click="fetchAccountHierarchy(props.row.id, 'S')"></el-button>
                                                </el-tooltip>
                                            </div>
                                            <div v-if="loadingHierarchy" class="d-block w-100 mt-10 py-20 rounded" 
                                                v-loading="true"
                                                element-loading-text="Loading Shared Hierarchy..."
                                                element-loading-background="rgba(122, 122, 122, 0.8)"
                                            >
                                            </div>
                                            <div v-else-if="props.row.id in accountsHierarchyStore" class="row">
                                                <div v-if="Object.keys(accountsHierarchyStore[props.row.id].shared_accounts_hierarchy).length == 0" class="p-4 rounded border border-dashed text-center">
                                                    No data available to be shown here. Please click the button above to load your data
                                                </div>
                                                <div v-else v-for="(hierarchy, _index) in accountsHierarchyStore[props.row.id].shared_accounts_hierarchy" class="col-lg-4 col-md-6 col-sm-12 mb-4">
                                                    <div class="card rounded">
                                                        <div class="card-body">
                                                            <div class="d-flex flex-column" style="min-width: 0">
                                                                <div class="d-flex justify-content-between w-100" style="min-width: 0">
                                                                    <div class="d-block text-truncate">
                                                                        <el-tooltip :content="hierarchy.name">
                                                                            <h5 class="mb-0 text-truncate">{{ hierarchy.name }}</h5>
                                                                        </el-tooltip>
                                                                    </div>
                                                                    <div class="d-flex">
                                                                        <el-tooltip :content="`This grouping has exactly ${Object.keys(hierarchy.constituents).length} ${Object.keys(hierarchy.constituents).length==1?'constituent':'constituents'}`">
                                                                            <div class="text-muted ms-3 badge badge-pill badge-muted bg-gray-200">{{ Object.keys(hierarchy.constituents).length }} {{ Object.keys(hierarchy.constituents).length==1?'Constituent':'Constituents' }}</div>
                                                                        </el-tooltip>
                                                                        <el-tooltip content="Start date of this grouping">
                                                                            <div class="text-primary ms-2 badge badge-pill bg-light-primary">{{ hierarchy.start_date }}</div>
                                                                        </el-tooltip>
                                                                    </div>
                                                                </div>
                                                                <small class="mt-2 d-block text-truncate"><strong>Scope: </strong><el-tooltip :content="hierarchy.scope"><span class="w-100">{{ hierarchy.scope }}</span></el-tooltip></small>
                                                                <strong class="mt-5 text-muted fs-7">Representative Account:</strong>
                                                                <div class="d-flex flex-column">
                                                                    <div class="d-flex align-items-center mt-3" style="min-width: 0;">
                                                                        <span class="d-flex flex-center flex-shrink-0 me-3">
                                                                            <div class="symbol symbol-40px symbol-circle">
                                                                                <div class="symbol-label fs-2 fw-semibold border border-info border-dashed" :style="`background-image: url(${hierarchy.representative_account.image?baseUrl+hierarchy.representative_account.image:'/public/media/logos/flexup-circle-color.svg'})`"></div>
                                                                            </div>
                                                                        </span>
                                                                        <el-tooltip :content="hierarchy.representative_account.account_name">
                                                                            <span class="fs-5 fw-bold text-gray-700 d-flex text-truncate" data-kt-element="title">{{ hierarchy.representative_account.account_name }}</span>
                                                                        </el-tooltip>
                                                                    </div>
                                                                    <div class="d-flex mt-3 justify-content-between">
                                                                        <div class="d-flex">
                                                                            <el-tooltip :content="`This is a ${getAccountType(hierarchy.representative_account.account_type)[0]} Account`">
                                                                                <div class="text-primary me-2 badge badge-pill bg-light-primary">{{ getAccountType(hierarchy.representative_account.account_type)[0] }} Account</div>
                                                                            </el-tooltip>
                                                                            <el-tooltip :content="`Account Country: ${countries[hierarchy.representative_account.country].name_long}`">
                                                                                <div class="text-primary me-2 badge badge-pill bg-light-primary">{{ hierarchy.representative_account.country }}</div>
                                                                            </el-tooltip>
                                                                            <el-tooltip :content="`Account Currency: ${currencies[hierarchy.representative_account.currency].long_name}`">
                                                                                <div class="text-primary badge badge-pill bg-light-primary">{{ hierarchy.representative_account.currency.toUpperCase() }}</div>
                                                                            </el-tooltip>
                                                                        </div>
                                                                        <el-tooltip :content="`Account Status: ${getAccountStatus(hierarchy.representative_account.status)}`">
                                                                            <div class="badge badge-pill"
                                                                                :class="{
                                                                                    'badge-success': hierarchy.representative_account.status === 'A',
                                                                                    'badge-danger': hierarchy.representative_account.status === 'C',
                                                                                    'badge-warning': hierarchy.representative_account.status === 'P',
                                                                                    'badge-info': hierarchy.representative_account.status === 'S',
                                                                                }"
                                                                            >{{ getAccountStatus(hierarchy.representative_account.status) }}</div>
                                                                        </el-tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                    <!-- <el-tab-pane label="Parent Hierarchy">
                                        [disabled if this has no parent accounts] display the whole parent account hierarchy for this account (still think it's no longer needed)
                                        <div class="px-3">
                                            <div class="d-flex w-100">
                                                <strong class="mb-0 fw-semibold">Shared Accounts:</strong>
                                                <el-tooltip :content="`This account has ${props.row.child_accounts.length} ${props.row.child_accounts.length==1?'sub-account':'sub-accounts'}`" placement="top">
                                                    <div class="badge badge-pill badge-primary ms-5">{{ props.row.child_accounts.length}} {{ props.row.child_accounts.length==1?'sub-account':'sub-accounts' }}</div>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </el-tab-pane> -->
                                    <el-tab-pane label="Child Hierarchy">
                                        <div class="px-3">
                                            <div class="d-flex w-100 mb-5">
                                                <strong class="mb-0 fw-semibold">Child Accounts:</strong>
                                                <el-tooltip :content="`This account has ${props.row.child_accounts.length} ${props.row.child_accounts.length==1?'child account':'child accounts'} (i.e. is a parent of these accounts)`" placement="top">
                                                    <div class="badge badge-pill badge-primary ms-5">{{ props.row.child_accounts.length}} {{ props.row.child_accounts.length==1?'child account':'child accounts' }}</div>
                                                </el-tooltip>
                                                <el-tooltip content="Load shared account(s) details" placement="top">
                                                    <el-button size="small" type="primary" :icon="Loading" class="ms-3" :disabled="loadingHierarchy" @click="fetchAccountHierarchy(props.row.id, 'C')"></el-button>
                                                </el-tooltip>
                                            </div>
                                            <div v-if="loadingHierarchy" class="d-block w-100 mt-10 py-20 rounded" 
                                                v-loading="true"
                                                element-loading-text="Loading Child Accounts..."
                                                element-loading-background="rgba(122, 122, 122, 0.8)"
                                            >
                                            </div>
                                            <div v-else-if="props.row.id in accountsHierarchyStore" class="row">
                                                <div v-if="Object.keys(accountsHierarchyStore[props.row.id].child_accounts_hierarchy).length == 0" class="p-4 rounded border border-dashed text-center">
                                                    No data available to be shown here. Please click the button above to load your data
                                                </div>
                                                <div v-else v-for="(account, _index) in accountsHierarchyStore[props.row.id].child_accounts_hierarchy" class="col-lg-4 col-md-6 col-sm-12 mb-4">
                                                    <div class="card rounded">
                                                        <div class="card-body">
                                                            <div class="d-flex flex-column" style="min-width: 0">
                                                                <div class="d-flex flex-column">
                                                                    <div class="d-flex align-items-center mt-3 justify-content-between" style="min-width: 0;">
                                                                        <div class="d-flex align-items-center">
                                                                            <span class="d-flex flex-center flex-shrink-0 me-3">
                                                                                <div class="symbol symbol-40px symbol-circle">
                                                                                    <div class="symbol-label fs-2 fw-semibold border border-info border-dashed" :style="`background-image: url(${account.image?baseUrl+account.image:'/public/media/logos/flexup-circle-color.svg'})`"></div>
                                                                                </div>
                                                                            </span>
                                                                            <el-tooltip :content="account.account_name">
                                                                                <span class="fs-5 fw-bold text-gray-700 d-block text-truncate" data-kt-element="title">{{ account.account_name }}</span>
                                                                            </el-tooltip>
                                                                        </div>
                                                                        <div class="d-flex">
                                                                            <el-tooltip :content="`This is a ${getAccountType(account.account_type)[0]} Account`">
                                                                                <div class="text-muted ms-3 badge badge-pill badge-muted bg-gray-200">{{ getAccountType(account.account_type)[0] }}</div>
                                                                            </el-tooltip>
                                                                            <el-tooltip :content="`This account's visibility is: ${getAccountVisibility(account.visibility)[0]}`">
                                                                                <div class="text-muted ms-3 badge badge-pill badge-muted bg-gray-200">{{ getAccountVisibility(account.visibility)[1] }}</div>
                                                                            </el-tooltip>
                                                                            <el-tooltip :content="`This account's presence is: ${getAccountPresence(account.presence)[0]}`">
                                                                                <div class="text-muted ms-3 badge badge-pill badge-muted bg-gray-200">{{ getAccountPresence(account.presence)[1] }}</div>
                                                                            </el-tooltip>
                                                                        </div>
                                                                    </div>
                                                                    <div class="d-flex mt-3 w-100 justify-content-between">
                                                                        <div class="d-flex">
                                                                            <el-tooltip :content="`Account Country: ${countries[account.country].name_long}`">
                                                                                <div class="text-primary me-2 badge badge-pill bg-light-primary">{{ account.country }}</div>
                                                                            </el-tooltip>
                                                                            <el-tooltip :content="`Account Currency: ${currencies[account.currency].long_name}`">
                                                                                <div class="text-primary badge badge-pill bg-light-primary">{{ account.currency.toUpperCase() }}</div>
                                                                            </el-tooltip>
                                                                        </div>
                                                                        <div class="d-flex">
                                                                            <el-tooltip :content="`Account Status: ${getAccountStatus(account.status)}`">
                                                                                <div class="badge badge-pill"
                                                                                    :class="{
                                                                                        'badge-success': account.status === 'A',
                                                                                        'badge-danger': account.status === 'C',
                                                                                        'badge-warning': account.status === 'P',
                                                                                        'badge-info': account.status === 'S',
                                                                                    }"
                                                                                >{{ getAccountStatus(account.status) }}</div>
                                                                            </el-tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Account Name" width="275px">
                        <template #default="scope">
                            <div class="d-flex align-items-center" style="min-width: 0;">
                                <div class="symbol symbol-30px me-5 border border-info border-dashed symbol-circle">
                                    <div class="symbol-label" :style="`background-image: url(${scope.row.image?scope.row.image:'/public/media/logos/flexup-circle-color.svg'})`"></div>
                                </div> 
                                <el-tooltip :content="scope.row.account_name" placement="top">
                                    <div class="d-block text-truncate">
                                        {{ scope.row.account_name }}
                                    </div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Account Type" width="200px" :filters="[
                        { text: accountTypeMapping.P, value: 'P' },
                        { text: accountTypeMapping.B, value: 'B' },
                        { text: accountTypeMapping.S, value: 'S' },
                        { text: accountTypeMapping.A, value: 'A' },
                        { text: accountTypeMapping.U, value: 'U' },
                    ]"
                    :filter-method="filterAccountType"
                    filter-placement="bottom-end"
                    >
                        <template #default="scope">
                            {{ getAccountType(scope.row.account_type)[0] }} Account
                        </template>
                    </el-table-column>
                    <el-table-column label="Status" width="150" :filters="[
                        { text: accountStatusMapping.P, value: 'P' },
                        { text: accountStatusMapping.A, value: 'A' },
                        { text: accountStatusMapping.S, value: 'S' },
                        { text: accountStatusMapping.C, value: 'C' },
                    ]"
                    :filter-method="filterAccountStatus"
                    filter-placement="bottom-end"
                    >
                        <template #default="scope">
                            {{ getAccountStatus(scope.row.status) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="My Role" width="100px" :filters="[
                        { text: accountRoleMapping.A, value: 'A' },
                        { text: accountRoleMapping.E, value: 'E' },
                        { text: accountRoleMapping.V, value: 'V' },
                    ]"
                    :filter-method="filterAccountRole"
                    filter-placement="bottom-end"
                    >
                        <template #default="scope">
                            {{ getAccountRole(getRoleByMemberId(scope.row, currentUser.id)) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="👁️" width="50px" :filters="[
                        { text: accountVisibilityMapping.PR[0], value: 'PR' },
                        { text: accountVisibilityMapping.PB[0], value: 'PB' },
                    ]"
                    :filter-method="filterAccountVisibility"
                    filter-placement="bottom-end"
                    >
                        <template #header>
                            <el-tooltip content="👁️ Visibility" placement="top">
                                <span>👁️</span>
                            </el-tooltip>
                        </template>
                        <template #default="scope">
                            <el-tooltip placement="top" :content="`This account's visibility is: ${getAccountVisibility(scope.row.visibility)[0]}`">
                                {{ getAccountVisibility(scope.row.visibility)[1] }}
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="🗺️" width="50px" :filters="[
                        { text: accountPresenceMapping.ON[0], value: 'ON' },
                        { text: accountPresenceMapping.OF[0], value: 'OF' },
                    ]"
                    :filter-method="filterAccountPresence"
                    filter-placement="bottom-end"
                    >
                        <template #header>
                            <el-tooltip content="🗺️ Presence" placement="top">
                                <span>🗺️</span>
                            </el-tooltip>
                        </template>
                        <template #default="scope">
                            <el-tooltip placement="top" :content="`This account's presence is: ${getAccountPresence(scope.row.presence)[0]}`">
                                {{ getAccountPresence(scope.row.presence)[1] }}
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="Details" width="230px">
                        <template #default="scope">
                            <div class="d-block">
                                <div class="d-flex align-items-center w-100 justify-content-start">
                                    <el-tooltip v-if="currentAccount.id==scope.row.id" content="This is the current account you're using" placement="top">
                                        <div class="border border-primary badge badge-circle badge-light-primary text-primary fs-2x me-4">
                                            <el-icon size="20"><SemiSelect /></el-icon>
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip v-else-if="currentAccount.owner_account==scope.row.id||currentAccount.child_accounts.includes(currentAccount.id)" :content="currentAccount.child_accounts?.includes(scope.row.id)?'Current account is a child (sub-account) of this account':'This account is a child account of current account'" placement="top">
                                        <div class="badge badge-circle badge-light-success text-success fs-2x me-4">
                                            <el-icon><CircleCheck /></el-icon>
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip v-else content="Current account has no relationship with this account" placement="top">
                                        <div class="badge badge-circle badge-light-danger text-danger fs-2x me-4">
                                            <el-icon><CircleClose /></el-icon>
                                        </div>
                                    </el-tooltip>
                                    <el-tooltip :content="`Account has ${scope.row.members.length} ${scope.row.members.length==1?'member':'members'}`" placement="left">
                                        <div class="badge badge-pill badge-info me-3">{{ scope.row.members.length}} {{ scope.row.members.length==1?'member':'members' }}</div>
                                    </el-tooltip>
                                    <el-tooltip :content="`Account has ${scope.row.child_accounts.length} ${scope.row.child_accounts.length==1?'sub-account':'sub-accounts'}`" placement="top">
                                        <div class="badge badge-pill badge-primary me-3">{{ scope.row.child_accounts.length}} {{ scope.row.child_accounts.length==1?'sub-account':'sub-accounts' }}</div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Action">
                        <template #default="scope">
                            <div class="pe-3">
                                <el-tooltip v-if="currentAccount.id != scope.row.id" content="Switch to this account">
                                    <el-button type="warning" size="small" @click="switchAccount(scope.row.id)">Switch</el-button>
                                </el-tooltip>
                                <el-tooltip v-else content="Cannot switch as you're already working as this account">
                                    <el-button type="success" disabled size="small" class="me-3">Current</el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
    <el-dialog v-model="newAccountFormVisible" title="Add a new account" width="80%" align-center=true>
        <el-form ref="newAccountFormRef" :model="newAccountForm" :rules="newAccountFormRules" v-if="errorsRead">
            <div class="mx-8">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="form-group mb-4 fv-row">
                            <div class="d-flex w-100 justify-content-between">
                                <label class="form-label required">Presence:</label>
                                <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.presence.specific_details.show = !helpTexts.presence.specific_details.show">{{ helpTexts.presence.specific_details.show?'Hide details':'Show details' }}</a></span>
                            </div>
                            <el-form-item prop="presence">
                                <el-select v-model="newAccountForm.presence" name="newAccountForm.presence" id="presence">
                                    <el-option value="ON" :selected="newAccountForm.presence=='ON'" label="🌐 Online"></el-option>
                                    <el-option value="OF" :selected="newAccountForm.presence=='OF'" label="📍 Offline"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            <span class="form-text" v-if="newAccountForm.presence=='ON'">This is a <strong>online</strong> account. It is actively managed and can interact with other accounts directly via the FlexUp app.</span>
                            <span class="form-text" v-else-if="newAccountForm.presence=='OF'">This is a <strong>offline</strong> account. It used for internal book-keeping only. It is visible only to the current account that created it.</span>
                        </div>
                    </div>
                    <div class="col-lg-8" v-if="helpTexts.presence.specific_details.show">
                        <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                            <span v-if="newAccountForm.presence=='ON'" v-html="helpTexts.presence.specific_details['ON']"></span>
                            <span v-else-if="newAccountForm.presence=='OF'" v-html="helpTexts.presence.specific_details['OF']"></span>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="newAccountForm.presence">
                    <div class="col-lg-4">
                        <div class="form-group mb-4 fv-row">
                            <div class="d-flex w-100 justify-content-between">
                                <label class="form-label required">Type:</label>
                                <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.account_type.specific_details.show = !helpTexts.account_type.specific_details.show;">{{ helpTexts.account_type.specific_details.show?'Hide details':'Show details' }}</a></span>
                            </div>
                            <el-form-item prop="account_type">
                                <el-select name="account_type" id="account_type" v-model="newAccountForm.account_type" placeholder="Please select an account type">
                                    <el-option v-if="newAccountForm.presence=='ON'" value="P" label="👤 Personal"></el-option>
                                    <el-option value="B" label="💼 Business"></el-option>
                                    <el-option v-if="newAccountForm.presence=='ON'" value="S" label="👥 Shared"></el-option>
                                    <el-option v-if="newAccountForm.presence=='ON'" value="A" label="🚀 Sub-Account"></el-option>
                                    <el-option v-if="newAccountForm.presence=='OF'" value="U" label="❓ Unspecified"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            <span class="form-text" v-if="newAccountForm.account_type=='P'">This account belongs to an <strong>individual</strong> owner (a physical person).</span>
                            <span class="form-text" v-else-if="newAccountForm.account_type=='B'">This account belongs to a <strong>legal entity</strong> owner (a juridical person/legal entity such as a company, NGO, fund,...).</span>
                            <span class="form-text" v-else-if="newAccountForm.account_type=='S'">This account belongs to a <strong>grouping</strong> owner (a collection of other accounts, called "constituents").</span>
                            <span class="form-text" v-else-if="newAccountForm.account_type=='A'">This account belongs to an <strong>account</strong> owner (another account, called its "parent").</span>
                            <span class="form-text" v-else-if="newAccountForm.account_type=='U'">This account belongs to an <strong>unspecified</strong> owner (for local accounts only, the account type can remain unspecified).</span>
                        </div>
                    </div>
                    <div class="col-lg-8" v-if="helpTexts.account_type.specific_details.show">
                        <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                            <span v-if="newAccountForm.account_type == 'P'" v-html="helpTexts.account_type.specific_details['P']"></span>
                            <span v-else-if="newAccountForm.account_type == 'B'" v-html="helpTexts.account_type.specific_details['B']"></span>
                            <span v-else-if="newAccountForm.account_type == 'S'" v-html="helpTexts.account_type.specific_details['S']"></span>
                            <span v-else-if="newAccountForm.account_type == 'A'" v-html="helpTexts.account_type.specific_details['A']"></span>
                            <span v-else-if="newAccountForm.account_type == 'U'" v-html="helpTexts.account_type.specific_details['U']"></span>
                        </div>
                    </div>
                </div>
                <div v-if="newAccountForm.presence == 'OF' || newAccountForm.account_type">
                    <div class="row">
                        <div class="col-12">
                            <p class="text-muted fw-semibold mb-0">Who should be able to see this account? What is the account visibility?</p>
                        </div>
                        <div class="col-lg-4" v-if="newAccountForm.presence == 'ON'">
                            <div class="form-group mb-4 fv-row">
                                <div class="d-flex w-100 justify-content-between">
                                    <label class="form-label required">Visibility:</label>
                                    <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.account_visibility.show = !helpTexts.account_visibility.show">{{ helpTexts.account_visibility.show?'Hide details':'Show details' }}</a></span>
                                </div>
                                <el-form-item prop="visibility">
                                    <el-select v-model="newAccountForm.visibility">
                                        <el-option value="PB" :selected="newAccountForm.visibility === 'PB'" label="📢 Public"></el-option>
                                        <el-option value="PR" :selected="newAccountForm.visibility === 'PR'" label="🔒 Private"></el-option>
                                    </el-select>
                                </el-form-item>
                                <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                <span class="form-text" v-if="newAccountForm.visibility=='PB'">This account is <strong>public</strong>, and is therefore visible in the FlexUp public account directory, allowing other users to find you (for example to pace an order).</span>
                                <span class="form-text" v-else-if="newAccountForm.visibility=='PR'">This account is <strong>private</strong>, and is <u>not</u> visible in the FlexUp <strong>public account directory</strong>. Other accounts can only see you (for example to place an order) if you are in <u>their</u> <strong>third-party directory</strong> (for example if you placed an order with them in the past).</span>
                            </div>
                        </div>
                        <div class="col-lg-8" v-if="helpTexts.account_visibility.show">
                            <div class="p-7 border-dashed border-warning bg-light-warning rounded">
                                <span v-html="helpTexts.account_visibility.text"></span>
                            </div>
                        </div>
                        <div v-if="newAccountForm.account_type == 'P'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h2 class="text-info fw-semibold mb-0">Individual Profile</h2>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this individual:</p>
                                <div class="row" v-if="newAccountForm.owner_individual">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">First Name:</label>
                                            </div>
                                            <el-form-item prop="owner_individual.first_name">
                                                <el-input v-model="newAccountForm.owner_individual.first_name" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Last Name:</label>
                                            </div>
                                            <el-form-item prop="owner_individual.last_name">
                                                <el-input v-model="newAccountForm.owner_individual.last_name" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Email Address:</label>
                                                <span class="d-flex"><a href="javascript:void(0)" class="link-primary fw-bold" @click="helpTexts.email.show = !helpTexts.email.show">{{ helpTexts.email.show?'Hide details':'Show details' }}</a></span>
                                            </div>
                                            <el-form-item prop="owner_individual.email_address">
                                                <el-input v-model="newAccountForm.owner_individual.email_address" />
                                            </el-form-item>
                                            <div class="p-5 bg-light-warning rounded" v-if="helpTexts.email.show">
                                                <span v-html="helpTexts.email.text"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Mobile Number:</label>
                                            </div>
                                            <el-form-item prop="owner_individual.mobile_number">
                                                <el-input v-model="newAccountForm.owner_individual.mobile_number" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 mb-4">
                                            <div class="form-group fv-row">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <label class="form-label required">Date of Birth:</label>
                                                </div>
                                                <el-form-item prop="owner_individual.date_of_birth">
                                                    <el-date-picker v-model="newAccountForm.owner_individual.date_of_birth" value-format="YYYY-MM-DD" />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold">Residence Country:</label>
                                            </div>
                                            <el-form-item prop="owner_individual.residence_country">
                                                <el-select placeholder="Country" filterable style="background-color: #f4f4f4f4 !important;" v-model="newAccountForm.owner_individual.residence_country" @change="setAccountCountry">
                                                    <el-option v-for="(obj, _country) in countries" :value="_country" :selected="_country == newAccountForm.owner_individual.residence_country" :label="obj.name_long">{{ obj.name_long }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label fs-6 fw-semibold">Residence Address:</label>
                                            </div>
                                            <el-form-item prop="owner_individual.residence_address">
                                                <el-input v-model="newAccountForm.owner_individual.residence_address" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="newAccountForm.account_type=='B'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h2 class="text-info fw-semibold mb-0">Legal Entity Profile</h2>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>legal entity</strong>:</p>
                                <div class="row" v-if="newAccountForm.owner_organization">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Legal Name:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.legal_name">
                                                <el-input v-model="newAccountForm.owner_organization.legal_name" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Legal Form:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.legal_form">
                                                <el-input v-model="newAccountForm.owner_organization.legal_form" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Registration Date:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.registration_date">
                                                <el-date-picker v-model="newAccountForm.owner_organization.registration_date" value-format="YYYY-MM-DD" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Registration Number:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.registration_number">
                                                <el-input v-model="newAccountForm.owner_organization.registration_number" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 mb-4">
                                            <div class="form-group fv-row">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <label class="form-label required">Registration City:</label>
                                                </div>
                                                <el-form-item prop="owner_organization.registration_city">
                                                    <el-input v-model="newAccountForm.owner_organization.registration_city" />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Registration Country:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.registration_country">
                                                <el-select placeholder="Country" filterable style="background-color: #f4f4f4f4 !important;" v-model="newAccountForm.owner_organization.registration_country" @change="setAccountCountry">
                                                    <el-option v-for="(obj, _country) in countries" :value="_country" :selected="_country == newAccountForm.owner_organization.registration_country" :label="obj.name_long">{{ obj.name_long }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Registration Address:</label>
                                            </div>
                                            <el-form-item prop="owner_organization.registered_address">
                                                <el-input v-model="newAccountForm.owner_organization.registered_address" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="newAccountForm.account_type=='S'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h2 class="text-info fw-semibold mb-0">Grouping Profile</h2>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>grouping</strong>:</p>
                                <div class="row" v-if="newAccountForm.owner_grouping">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Name:</label>
                                            </div>
                                            <el-form-item prop="owner_grouping.name">
                                                <el-input v-model="newAccountForm.owner_grouping.name" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Start Date:</label>
                                            </div>
                                            <el-form-item prop="owner_grouping.start_date">
                                                <el-date-picker v-model="newAccountForm.owner_grouping.start_date" value-format="YYYY-MM-DD" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-4">
                                        <div class="form-group">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Scope:</label>
                                            </div>
                                            <el-form-item prop="owner_grouping.scope">
                                                <el-input
                                                    v-model="newAccountForm.owner_grouping.scope"
                                                    style="width: 240px"
                                                    autosize
                                                    type="textarea"
                                                    placeholder="Describe what this grouping is about"
                                                />
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="newAccountForm.account_type=='A'" class="row mt-5">
                            <div class="col-12 border p-10 rounded border-dashed">
                                <h2 class="text-info fw-semibold mb-0">Subaccount Profile</h2>
                                <p class="text-muted fw-semibold mb-6">Please provide key details uniquely identify this <strong>subaccount</strong>, and differentiate it from the other activities of its parent account:</p>
                                <div class="row">
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Subaccount Name:</label>
                                            </div>
                                            <el-form-item prop="account_name">
                                                <el-input v-model="newAccountForm.account_name" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Parent Account:</label>
                                            </div>
                                            <el-form-item prop="owner_account">
                                                <el-select name="owner_account" id="owner_account" v-model="newAccountForm.owner_account" filterable placeholder="Select an account you have access to">
                                                    <el-option v-for="(account, account_id) in accounts" :value="account.id" :selected="newAccountForm.owner_account == account.id" :label="account.account_name">{{ account.account_name }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-4">
                                        <div class="form-group fv-row">
                                            <div class="d-flex w-100 justify-content-between">
                                                <label class="form-label required">Scope:</label>
                                            </div>
                                            <el-form-item prop="scope">
                                                <el-input v-model="newAccountForm.scope" type="textarea" autosize />
                                            </el-form-item>
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
                        <div v-else-if="newAccountForm.account_type == 'U'" class="row">
                            <div class="col-lg-6 mb-4">
                                <div class="form-group fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label required">Account Name:</label>
                                    </div>
                                    <el-form-item prop="account_name">
                                        <el-input v-model="newAccountForm.account_name" />
                                    </el-form-item>
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
                                        <label class="form-label required">Image:</label>
                                    </div>
                                    <div class="symbol symbol-100px symbol-circle" for="account_image">
                                        <label class="symbol-label cursor-pointer" :style="{ backgroundImage: `url(${imageData})`} ">
                                            <input ref="imageField" type="file" name="account_image" id="account_image" class="d-none" accept=".png, .jpg, .jpeg" @change="onFileChange"  />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 mb-4">
                                <div class="form-group fv-row">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-label required">Account Country:</label>
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
                                    <el-form-item prop="country">
                                        <el-select ref="countryField" placeholder="Country" filterable style="background-color: #f4f4f4f4 !important;" v-model="newAccountForm.country"  @change="selectNADefaultCurrency">
                                            <el-option v-for="(obj, _country) in countries" :value="_country" :selected="_country == newAccountForm.country" :label="obj.name_long">{{ obj.name_long }}</el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 mb-4">
                                <div class="form-group">
                                    <div class="d-flex w-100 justify-content-between align-items-center">
                                        <label class="form-label required">Account Currency:</label>
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
                                    <el-form-item prop="currency">
                                        <el-select placeholder="Currency" style="background-color: #f4f4f4f4 !important;"  v-model="newAccountForm.currency">
                                            <el-option v-for="(obj, _currency) in currencies" :value="_currency" :selected="_currency == newAccountForm.currency" :label="`${obj.symbol} ${obj.long_name}`">{{ obj.symbol }} {{ obj.long_name }}</el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-start">
                    <el-button v-if="!isLoading" type="success" @click="submitAccountCreation">Submit Data</el-button>
                    <el-button v-else type="success" loading disabled>Submitting Data...</el-button>
                </div>
            </div>
        </el-form>
        <template v-else>
            <div class="p-10 mb-10">
                <h3 class="text-danger">The following errors have occured:</h3>
                <div v-html="errors"></div>
            </div>
            <el-button @click="errorsRead = true" type="danger">I understand</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { ElSelect, ElOption, ElInput, ElForm, ElFormItem, ElDialog, ElButton } from 'element-plus';
import { useOptionsetStore } from '@/stores/optionsets';
import { useAuthStore } from '@/stores/auth';
import { useAccountsStore, accountTypeMapping, accountStatusMapping, accountVisibilityMapping, accountPresenceMapping, accountRoleMapping, type Account } from '@/stores/accounts';
import ApiService from '@/core/services/ApiService';
import { Loading } from '@element-plus/icons-vue';
import Swal from 'sweetalert2';
import { processErrors, convertToFormData } from "@/core/helpers/processing";
import { ElMessage } from 'element-plus'
import * as Yup from 'yup';

const baseUrl = ApiService.getBaseUrl();

const accountStore = useAccountsStore();
const accounts = computed<Account[]>(() => accountStore.accounts);
const optionsetStore = useOptionsetStore();
const authStore = useAuthStore();

const currentAccount = computed(() => accountStore.currentAccount);
const currentUser = computed(() => authStore.getUser());

const countryField = ref<null|HTMLInputElement>(null);

const countries = computed(() => optionsetStore.countries);
const currencies = computed(() => optionsetStore.currencies);

const search = ref('');

const getAccountType = (accountType: string) => {
    return accountTypeMapping[accountType];
}

const accountsTable = ref(null);

const accountsHierarchyStore = ref({});
const loadingHierarchy = ref(false);

const errors = ref('');
const errorsRead = ref(true);
const newAccountFormVisible = ref(false);
const newAccountFormRef = ref();
const newAccountForm = reactive({
    account_name: null,
    presence: null,
    account_type: null,
    visibility: "PB",
    country: null,
    currency: null,
    scope: null,
    owner_individual: {
        first_name: null,
        last_name: null,
        email_address: null,
        mobile_number: null,
        date_of_birth: null,
        residence_country: null,
        residence_address: null,
    },
    owner_organization: {
        legal_name: null,
        legal_form: null,
        registration_date: null,
        registration_number: null,
        registration_city: null,
        registration_country: null,
        registered_address: null,
    },
    owner_grouping: {
        name: null,
        start_date: null,
        scope: null,
    },
    owner_account: null,
});

const setAccountCountry = () => {
    if (newAccountForm.account_type == 'P') {
        newAccountForm.country = newAccountForm.owner_individual.residence_country;
    }
    else if (newAccountForm.account_type == 'B') {
        newAccountForm.country = newAccountForm.owner_organization.registration_country;
    }

    if (countryField.value) {
        countryField.value.$emit('change', countryField.value.value);
    }
}


const imageField = ref<null|HTMLInputElement>(null);
const maxFileSize = 2 * 1024 * 1024;
const imageData = ref(`${baseUrl}/static/img/image-placeholder.svg`);
const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file.size > maxFileSize) {
        Swal.fire({
            icon: 'error',
            title: 'File too large',
            text: 'The selected file is too large. Please select a file that is less than 2MB in size.',
        });
        if (imageField.value) {
            imageField.value.value = '';
        }
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        if (e.target) {
            imageData.value = e.target.result as string;
        }
    };
    
    reader.readAsDataURL(file);
};

const isLoading = ref(false);

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
        <p class="mb-0"><strong>- 💼 business:</strong> represents a legal entity 🏢 (ie. juridical person, organization, business),</p>
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
            <p>A <strong>business account</strong> represents and belongs to a <strong>legal entity</strong>.</p>
            <ul>
                <li>A legal entity is a juridical person: an entity which has a legal personality and is duly registered, such as a company, an NGO, a registered professional or a public entity. </li>
                <li>A user can create, edit or view a business accounts only if they have been duly authorized by this legal entity. </li>
                <li>A legal entity can only have one business account (which is the legal entity's "<strong>main</strong>" account).</li>
            </ul>
            `,
            'A': `
            <p>A <strong>subaccount 🚀</strong> represents a sub-set of economic activities of its <strong>parent</strong> account.
                <ul>
                    <li>Subaccounts are owned by their parent account's owners.</li>
                    <li>They can be used for specific projects or segments within the parent account’s activities, such as a legal entity business unit or branch, or for a personal project or hobby. </li>
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
                <li>The account's country should, in principal, be equal to that of their <strong>owners</strong> (<strong>users</strong>, <strong>legal entites</strong> and <strong>groupings</strong>).</li>
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

const newAccountFormRules = computed(() => {
    return {
        account_name: [
            { required: newAccountForm.account_type=='U'||newAccountForm.account_type=='A', message: "Account name is required", trigger: "blur" },
        ],
        presence: { required: true, message: "Presence is required", trigger: "change" },
        account_type: { required: true, message: "Account type is required", trigger: "change" },
        visibility: { required: true, message: "Visibility is required", trigger: "change" },
        country: { required: true, message: "Country is required", trigger: "change" },
        currency: { required: true, message: "Currency is required", trigger: "change" },
        owner_individual: {
            first_name: { required: newAccountForm.account_type == 'P', message: "First name is required", trigger: "blur" },
            last_name: { required: newAccountForm.account_type == 'P', message: "Last name is required", trigger: "blur" },
            email_address: [{ required: newAccountForm.account_type == 'P', message: "Email is required", trigger: "blur" }, { type: 'email', message: "Please input a valid email address", trigger: "blur" }],
        },
        owner_organization: {
            legal_name: { required: newAccountForm.account_type == 'B', message: "Legal name is required", trigger: "blur" },
            legal_form: { required: newAccountForm.account_type == 'B', message: "Legal form is required", trigger: "blur" },
            registration_date: { required: newAccountForm.account_type == 'B', message: "Registration date is required", trigger: "change" },
            registration_number: { required: newAccountForm.account_type == 'B', message: "Registration number is required", trigger: "blur" },
            registration_city: { required: newAccountForm.account_type == 'B', message: "Registration city is required", trigger: "blur" },
            registration_country: { required: newAccountForm.account_type == 'B', message: "Registration country is required", trigger: "change" },
            registered_address: { required: newAccountForm.account_type == 'B', message: "Registered address is required", trigger: "blur" },
        },
        owner_grouping: {
            name: { required: newAccountForm.account_type == 'S', message: "Grouping name is required", trigger: "blur" },
            start_date: { required: newAccountForm.account_type == 'S', message: "Grouping start date is required", trigger: "change" },
            scope: { required: newAccountForm.account_type == 'S', message: "Scope is required", trigger: "blur" },
        },
        owner_account: { required: newAccountForm.account_type == 'A', message: "Owner account is required", trigger: "change" },
    }
})


const selectNADefaultCurrency = () => {
    console.log('Country changed')
    if (newAccountForm.country) {
        console.log('NA Country: ', newAccountForm.country)
        const selectedCountry = countries.value[newAccountForm.country];
        console.log(newAccountForm.country, countries)
        console.log(selectedCountry)
        if (selectedCountry) {
            newAccountForm.currency = selectedCountry.currency;
        }
    }
}

const fetchAccountHierarchy = async (accountId: number, hierarchyOrder: string) => {
    loadingHierarchy.value = true;
    if (!(accountId in accountsHierarchyStore.value)) {
        accountsHierarchyStore.value[accountId] = {
            shared_accounts_hierarchy: [],
            parent_accounts_hierarchy: [],
            child_accounts_hierarchy: [],
        };
    }


    try {
        const response = await ApiService.query(`/api/v2/accounts/hierarchy?account_id=${accountId}&hierarchy_order=${hierarchyOrder}`)
        let _account = accounts.value.find(acc => acc.id === accountId);
        console.log('ResponseP; ', response.data)
        if (_account) {
            if (hierarchyOrder === 'S') {
                accountsHierarchyStore.value[accountId].shared_accounts_hierarchy = response.data;
            } else if (hierarchyOrder === 'P') {
                accountsHierarchyStore.value[accountId].parent_accounts_hierarchy = response.data;
            } else if (hierarchyOrder === 'C') {
                accountsHierarchyStore.value[accountId].child_accounts_hierarchy = response.data;
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Account not found',
            });
        }
        loadingHierarchy.value = false;
    } catch (error) { 
        console.log('Hierarchy Fetch Error: ', error)
        loadingHierarchy.value = false;
    }
}

const getAccountVisibility = (accountVisibility: string) => {
    return accountVisibilityMapping[accountVisibility];
}

const getAccountPresence = (accountPresence: string) => {
    return accountPresenceMapping[accountPresence];
}

const getAccountRole = (accountRole: string) => {
    return accountRoleMapping[accountRole];
}

const getAccountStatus = (accountStatus: string) => {
    return accountStatusMapping[accountStatus];
}

const switchAccount = (accountId: number) => {
    const account = accountStore.accounts.find(acc => acc.id === accountId);
    if (account) {
        accountStore.setAccount(account);
    }
}

const resetNewAccountForm = () => {
    console.log('reset called')
    if (!newAccountFormRef.value) return
    newAccountFormRef.value.resetFields()
    console.log('form has been reset: ', newAccountFormRef.value)
    if (imageField.value) {
        imageField.value.value = '';
    }
};

const submitAccountCreation = async () => {
    isLoading.value = true;
    console.log('IS LOADING')
    if (!newAccountFormRef.value) {
        console.log('NO LONGER LOADING!!')
        isLoading.value = false;
        return;
    }
    
    await newAccountFormRef.value.validate((valid, fields) => {
        if (valid) {
            console.log("Validation passed: ", newAccountForm);
            const newAcountDeets = {
                ...newAccountForm,
                current_account: currentAccount.value.id
            } 

            const formData = convertToFormData(newAcountDeets);
            if (imageField.value && imageField.value.files.length>0) {
                console.log('Uploaded image to formData')
                formData.append('image', imageField.value.files[0]);
            }

            console.log('\n\n\nnewAcountDeets', formData, '\n\n\n')
            ApiService.multipartPost("/api/v2/accounts/accounts/", formData).then((response) => {
                ElMessage({
                    message: 'Account created successfully',
                    type: 'success'
                })
                accountStore.addAccount(response.data);
                ElMessage({
                    message: `Account "${response.data.account_name}" has been added to accounts list.`,
                    type: 'success'
                })
                resetNewAccountForm()
                isLoading.value = false;
                newAccountFormVisible.value = false;
                
            }).catch((error) => {
                console.log('Submission Error: ', error)
                if (error.response.status && error.response.status == 400) {
                    errors.value = processErrors(error.response.data);
                    errorsRead.value = false;
                } else {
                    console.log('The following error has occured: ', error)
                }
                isLoading.value = false;
            });
        } else {
            ElMessage({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `<h6 class="text-danger mb-0">There are errors in your form!</h6>Please correct these errors before you submit the data.`,
                type: 'error'
            })
            isLoading.value = false;
        }
    });
}

function getRoleByMemberId(account, userId) {
  const member = account.members.find(member => member.user.id === userId);
  return member ? member.role : null;
}

const filterTableData = computed(() =>
    accounts.value.filter(
        (data: Account) =>
        !search.value ||
        data.account_name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const filterAccountType = (value: string, row: Account) => {
  return row.account_type === value
}

const filterAccountRole = (value: string, row: Account) => {
  return getRoleByMemberId(row, currentUser.value.id) === value
}

const filterAccountVisibility = (value: string, row: Account) => {
  return row.visibility === value
}

const filterAccountPresence = (value: string, row: Account) => {
  return row.presence === value
}

const filterAccountStatus = (value: string, row: Account) => {
  return row.status === value
}

const handleDelete = (index: number, row: Account) => {
    console.log('Index:', index);
    console.log('Row:', row);
}

onMounted(() => {
    accountStore.fetchAccounts();
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
</style>