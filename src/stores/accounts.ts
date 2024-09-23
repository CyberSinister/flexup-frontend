import { computed, onMounted, ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore, type User } from "./auth";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { ElLoading, ElMessage } from 'element-plus'

export interface BaseAccount {
    id: number;
    image: string | null;
    label: string | null;
    account_name: string;
    account_type: string;
    country: string;
    currency: string;
    presence: 'ON' | 'OF';
    scope: string;
    status: string;
    visibility: string;
}

export interface AccountMember {
    id: number;
    account: BaseAccount;
    user: User;
    role: string;
    focus: string;
    created_at: string;
    updated_at: string;
}

export const accountTypeMapping: Record<string, string[]> = {
    P: ['👤 Personal', '👤'],
    B: ['💼 Business', '💼'],
    S: ['👥 Shared', '👥'],
    A: ['🚀 Sub', '🚀'],
    U: ['❓ Undefined', '❓']
};

export const accountVisibilityMapping: Record<string, string[]> = {
    PR: ['🔒 Private', '🔒'],
    PB: ['📢 Public', '📢'],
};

export const accountPresenceMapping: Record<string, string[]> = {
    ON: ['🌐 Online', '🌐'],
    OF: ['📍 Offline', '📍'],
};

export const accountStatusMapping: Record<string, string> = {
    P: "Pending",
    A: "Active",
    S: "Suspended",
    C: "Closed",
}

export const accountRoleMapping: Record<string, string> = {
    A: "🔑 Admin",
    E: "✏️ Editor",
    V: "👀 Viewer",
}

export interface Account extends BaseAccount {
    is_system_created: boolean;
    members: AccountMember[];
    creator_member?: AccountMember;
    creator_user: number;
    name: string;
    email: string;
    password: string;
    child_accounts?: number[];
    shared_accounts?: number[];
    shared_accounts_heirarchy?: Object[];
    child_accounts_heirarchy?: Object[];
    created_at: string;
    updated_at: string;
};

export const useAccountsStore = defineStore("accounts", () => {
    const authStore = useAuthStore();
    const currentUser = computed(() => authStore.getUser());

    const accounts = ref<Account[]>([]);
    const primaryAccount = ref({} as Account);
    const currentAccount = ref({} as Account);
    const loadingAccounts = ref(false);
    const accountsLoadingFailed = ref(false);
    const loading = ref(false);
    const error = ref(null);

    onMounted(() => {
        const _currentAccount = localStorage.getItem('currentAccount');
        if (_currentAccount) {
            console.log('Current Account:', _currentAccount);
            currentAccount.value = JSON.parse(_currentAccount);
        }
    });
    
    const setAccount = (account: Account) => {
        console.log('Setting Account:', account);
        currentAccount.value = account;
        localStorage.setItem('currentAccount', JSON.stringify(account));
    }

    const removeAccount = (account: Account) => {
        if (currentAccount.value.id === account.id) {
            setAccount(primaryAccount.value);
            ElMessage.success('Account removed successfully!');
            ElMessage.success('Switched to default primary account: ' + primaryAccount.value.account_name);
        }
        const index = accounts.value.findIndex(acc => acc.id === account.id);
        if (index !== -1) {
            accounts.value.splice(index, 1);
        }
    }

    const updateField = (accountId: number, fieldName: string, newValue: any) => {
        const account = accounts.value.find(acc => acc.id === accountId);
        if (account) {
            console.log('Found account: ', account)
            account[fieldName] = newValue;
            console.log('Updated')
            if (accountId == currentAccount.value.id) {
                let __currentAccount = currentAccount.value;
                __currentAccount[fieldName] = newValue;
                setAccount(__currentAccount);
            }
        } else {
            console.error(`Account with id ${accountId} not found`);
        }
    };

    const filterAccountsByMemberUserAndRole = (userId: number, role: string): Account[] => {
        return accounts.value.filter(account => 
            account.account_type === 'P' &&
            account.is_system_created &&
            account.members.some(member => member.user.id === userId && member.role === role)
        );
    };

    const getAccountType = (account: Account) => {
        return accountTypeMapping[account.account_type] || account.account_type;
    };

    const getAccount = (accountId: number): Account | undefined => {
        return accounts.value.find(account => account.id === accountId);
    };

    const getAccountMember = (account, userId) => {
        for (let key in account.members) {
            if (account.members[key].user.id == userId) {
                return account.members[key];
            } else {
                return {
                    'role': 'V'
                }
            };
        }
    }

    const updateAccount = (updatedAccount) => {
        const index = accounts.value.findIndex(account => account.id === updatedAccount.id);
        if (index !== -1) {
            accounts.value.splice(index, 1, updatedAccount);
        }

        if (currentAccount.value.id == updatedAccount.id) {
            setAccount(updatedAccount);
        }
    }

    const addAccount = async (account: Account) => {
        accounts.value.push(account);
        if (account.account_type == 'A') {
            const parentAccount = getAccount(account.owner_account);
            if (parentAccount) {
                parentAccount.child_accounts.push(account.id);
                updateAccount(parentAccount);
                if (currentAccount.value.id == parentAccount.id) {
                    setAccount(parentAccount);
                }
            }
        }
    }

    const fetchAccounts = async (silent=false) => {
        if (loadingAccounts.value) return;
        loadingAccounts.value = true;
        let loading;
        if (!silent) {
            loading = ElLoading.service({
                lock: true,
                text: 'Loading Accounts... please wait!',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        }
        try {
            const response = await ApiService.get('/api/v2/accounts/accounts');
            accounts.value = response.data;

            if (accounts.value.length > 0) {
                primaryAccount.value = filterAccountsByMemberUserAndRole(currentUser.value.id, 'A')[0];
                
                if (!(Object.keys(currentAccount.value).length>0)) {
                    setAccount(primaryAccount.value);
                } else {
                    const _currentAccount = accounts.value.find(account => account.id === currentAccount.value.id);
                    if (_currentAccount) {
                        setAccount(_currentAccount);
                    }
                }
                console.log('Accounts:', accounts.value);
                const _currentUserAccount = currentUser.value.primary_account?accounts.value.find(account => account.id === currentUser.value.primary_account.id):null;
                console.log('Current User Account:', _currentUserAccount);
                if (_currentUserAccount) {
                    const _currentUser = {...currentUser.value};
                    _currentUser.primary_account = _currentUserAccount;
                    _currentUser.primary_individual = _currentUserAccount.owner_individual;
                    console.log('Current User:', _currentUser);
                    setAccount(_currentUserAccount);
                }
            }
        } catch (e: Error | any) {
            console.log('Error:', e);
            if (e.response) {
                error.value = e.response.data;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'The FlexUp control panel server is unreachable. Please check your internet connection and try again.',
                })
            }
            accountsLoadingFailed.value = true;
        }
        if (!silent) {
            loading.close();
        }
        loadingAccounts.value = false;
    }

    fetchAccounts();

    return {
        accounts, primaryAccount, getAccountType,
        currentAccount, setAccount, getAccount, removeAccount,
        loading, error, updateField,
        loadingAccounts, accountsLoadingFailed,
        filterAccountsByMemberUserAndRole, getAccountMember,
        fetchAccounts, addAccount, updateAccount
    };
});
