import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { ElLoading } from 'element-plus'
import { useAccountsStore, type Account } from "./accounts";

export type ProductStatus = 'A' | 'P' | 'E';

export interface Product {
    id: number;
    account: Account;
    current_account?: Account;
    name: string;
    base_price: number;
    tax_rate: number;
    currency: string;
    status: ProductStatus;
    unit: string;
    is_unit_custom: boolean;
    unit_custom?: string;
    description: string;
    created: string;
    updated: string;
    is_archived: Boolean;
    is_starred: Boolean;
}

export const useProductStore = defineStore("products", () => {
    const accountStore = useAccountsStore();
    const currentAccount = computed(() => accountStore.currentAccount);
    
    const loadingProducts = ref(false);
    const productsLoadingFailed = ref(false);
    const error = ref();

    const products = ref<Product[]>([]);
    const statusOption = {
        P: { label: 'Pending' },
        A: { label: 'Active' },
        E: { label: 'Expired' }
    };
    const fetchProducts = async () => {
        if (loadingProducts.value) return;
        loadingProducts.value = true;
        try {
            console.log('Fetching Products')
            const response = await ApiService.get(`/api/v2/products`, `products?account_id=${currentAccount.value.id}`);
            console.log('Products response: ', response)
            products.value = response.data;
            productsLoadingFailed.value = false;
        } catch (e) {
            console.log('Accounts fetch error: ', e);
            if (e.response) {
                error.value = e.response.data;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'The FlexUp control panel server is unreachable. Please check your internet connection and try again.',
                })
            }
            productsLoadingFailed.value = true;
        }
        loadingProducts.value = false;
    }

    const createProduct = async (product) => {
        if (!currentAccount.value) return;

    }
    const addProducts = async (product: Product) => {
        products.value.push(product);
    }
    const deleteProduct = (productId) => {
        const index = products.value.findIndex(product => product.id === productId);
        if (index !== -1) {
            products.value.splice(index, 1);
        }
    };
    const updateProduct = (updatedProduct) => {
        const index = products.value.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
            products.value.splice(index, 1, updatedProduct);
        }
    }
    watch(currentAccount, () => {
        fetchProducts();
    });

    return {
        products, loadingProducts,
        productsLoadingFailed, fetchProducts,
        addProducts,statusOption,updateProduct,
        deleteProduct
    }
});