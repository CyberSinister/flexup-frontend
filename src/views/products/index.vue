<template>
    <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <div class="d-flex flex-column flex-column-fluid">
            <div id="kt_app_content" class="app-content flex-column-fluid justify-content-center">
                <div id="kt_app_content_container" class="app-container container-fluid mt-20">
                    <div class="row mt-10">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="d-flex align-items-center">
                                <i class="ki-duotone ki-lots-shopping fs-2x text-dark">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                    <span class="path4"></span>
                                    <span class="path5"></span>
                                    <span class="path6"></span>
                                    <span class="path7"></span>
                                    <span class="path8"></span>
                                </i>
                                <h1 class="fs-2 fw-bolder ms-3 mb-0">Products</h1>
                            </div>
                            <div class="d-flex">
                                <button class="btn btn-success ms-3 btn-sm rounded" @click="newProductFormVisible = true">New Product</button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between px-0 mt-15 w-100">
                        <div class="d-flex">
                            <div class="d-flex flex-wrap">
                                <el-tooltip :content="'update status of selected products'" placement="top-start">
                                    <el-select 
                                        v-model="selectedUpdateStatus" 
                                        placeholder="Status" 
                                        size="large" 
                                        class="w-150px" 
                                        @change ="updateSelectedStatus"
                                        
                                        >
                                        <el-option 
                                            v-for="(item, key) in status" 
                                            :key="key" 
                                            :label="item.label" 
                                            :value="key" />
                                    </el-select>
                                </el-tooltip>
                            </div>
                            <div class="d-flex flex-wrap ps-2 pe-0">
                                <el-tooltip :content="'archive and unarchive selected products'" placement="top-start">
                                    <el-button class="py-6" @click="updateArchive">
                                        <v-icon name="bi-archive-fill" class="fs-3 cursor-pointer" />
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="d-flex">
                                <div class="d-flex">
                                    <el-tooltip :content="'search by products name or products description'" placement="top-start">
                                        <el-form
                                            data-kt-search-element="form" 
                                            class="w-lg-350px w-md-200px w-sm-100px  w-100px d-lg-block position-relative mb-5 mb-lg-0" 
                                            autocomplete="off"
                                            style="height: 45px;">
                                            <i class="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute" 
                                                style="top: 50%; left: 15px; transform: translateY(-50%);"></i>
                                            <input 
                                                type="text" 
                                                class="search-input form-control form-control border h-lg-45px ps-13" 
                                                v-model="searchQuery"
                                                placeholder="Search..." 
                                                data-kt-search-element="input" 
                                                style="height: 45px; padding-left: 40px;" 
                                            />
                                            <span 
                                                class="search-reset btn btn-flush btn-active-color-primary position-absolute" 
                                                style="top: 50%; right: 10px; transform: translateY(-50%);"
                                                data-kt-search-element="clear" 
                                                v-if="searchQuery" 
                                                @click="searchQuery = ''">
                                                <i class="ki-outline ki-cross fs-2 fs-lg-1"></i>
                                            </span>
                                        </el-form>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap">
                                <el-tooltip :content="'filter products by status'" placement="top-start">
                                    <el-select 
                                        v-model="selectedStatus" 
                                        placeholder="Status" 
                                        size="large" 
                                        class="w-150px ms-3" 
                                        clearable 
                                        multiple>
                                        <el-option 
                                            v-for="(item, key) in status" 
                                            :key="key" 
                                            :label="item.label" 
                                            :value="key" />
                                    </el-select>
                                </el-tooltip>
                            </div>
                            <div class="d-flex flex-wrap ps-2 pe-0" @click="toggleArchiveList">
                                <el-tooltip :content="'filter archive products'" placement="top-start">
                                    <el-button class="py-6">
                                        <v-icon v-if="archiveToggleState === 'N'" name="bi-archive" class="fs-3 cursor-pointer" /> 
                                        <v-icon v-else-if="archiveToggleState === 'A'" name="bi-archive-fill" class="fs-3 cursor-pointer" />
                                        <v-icon v-else name="bi-archive-fill" class="fs-3 text-primary cursor-pointer" /> 
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex w-100 px-0 py-5">
                        <div class="d-flex w-100 g-5 g-xl-10">
                            <div class="card-body pt-2">
                                <el-table
                                    :data="filteredProducts"
                                    stripe
                                    border
                                    style="width: 100%"
                                    @row-click='handleRowClick'
                                    @selection-change="handleSelectionChange"
                                    class="rounded"
                                    :empty-text="isLoading ? 'Loading...' : 'No data available'"
                                >
                                    <el-table-column type="selection" />
                                    <el-table-column prop="name" label="Name" width="200" />
                                    <el-table-column prop="base_price" label="Price excl. tax" width="150" />
                                    <el-table-column prop="tax_rate" label="Tax %" width="100" />
                                    <el-table-column label="Price incl. tax" width="200">
                                    <template #default="props">
                                        {{ (props.row.base_price * (1 + props.row.tax_rate / 100)).toFixed(2) }}
                                    </template>
                                    </el-table-column>
                                    <el-table-column label="Status" width="100">
                                    <template #default="props">
                                        <span class="ms-4">{{ status[props.row.status].label }}</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column label="Archive" align="center">
                                    <template #default="scope">
                                        <el-icon @click.stop="toggleArchive(scope.row)">
                                        <el-tooltip :content="scope.row.is_archived ? 'click to unarchive the product' : 'click to archive the product'" placement="top-start">
                                            <v-icon v-if="!scope.row.is_archived" name="bi-archive" class="fs-3 cursor-pointer" />
                                            <v-icon v-else name="bi-archive-fill" class="fs-3 cursor-pointer" />
                                        </el-tooltip>
                                        </el-icon>
                                    </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    <el-dialog v-model="newProductFormVisible" title="Add a new product" width="80%" align-center=true>
                        <el-form ref="newProductFormRef" :model="newProductForm" :rules="newProductFormRules">
                            <div class="mx-8">
                                <div class="row">
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Name:</label>
                                        <el-form-item prop="name">
                                            <el-input v-model="newProductForm.name" placeholder="Enter a name for your product" />
                                        </el-form-item>
                                    </div>
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Currency:</label>
                                        <el-form-item prop="currency">
                                            <el-select placeholder="Select a currency this product is dealt in" style="background-color: #f4f4f4f4 !important;"  v-model="newProductForm.currency">
                                                <el-option v-for="(obj, _currency) in currencies" :value="_currency" :selected="_currency == newProductForm.currency" :label="`${obj.symbol} ${obj.long_name}`">{{ obj.symbol }} {{ obj.long_name }}</el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Unit:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item v-if="!newProductForm.is_unit_custom" prop="unit" class="w-100 me-3">
                                                <el-select placeholder="Select a unit this product is dealt in" style="background-color: #f4f4f4f4 !important;"  v-model="newProductForm.unit">
                                                    <el-option v-for="(obj, _unit) in units" :value="_unit" :selected="_unit == newProductForm.unit" :label="obj.display">{{ obj.display }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item v-else prop="unit_custom" class="w-100 me-3">
                                                <el-input v-model="newProductForm.unit_custom" placeholder="Enter your custom unit" />
                                            </el-form-item>
                                            <el-form-item label="Custom Unit" prop="is_unit_custom">
                                                <el-switch v-model="newProductForm.is_unit_custom" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-4 d-none d-sm-block"></div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Price excluding tax:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item prop="base_price" class="w-100 me-3">
                                                <el-input v-model="newProductForm.base_price" type="number" placeholder="Enter base price" step="1.00" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-4 d-none d-sm-block"></div>
                                    <div class="col-lg-6 col-md-4 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Tax:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item >
                                                <el-popover placement="top-start" trigger="hover" content="Price after tax">
                                                    <template #reference >
                                                        <el-input v-model="newPriceAfterTax" type="number" disabled class="me-3"></el-input>
                                                    </template>
                                                </el-popover>
                                            </el-form-item>
                                            <el-form-item prop="base_price" class="w-100 me-3">
                                                <el-input v-model="newProductForm.tax_rate" type="number" placeholder="Enter tax rate" step=".01"><template #suffix>%</template></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Status</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item prop="status" class="w-100 me-3">                                                <el-select placeholder="Select a status" style="background-color: #f4f4f4f4 !important;"  v-model="newProductForm.status">
                                                    <el-option v-for="(obj, _status) in status" :value="_status" :selected="_status == newProductForm.status" :label="obj.label">{{ obj.label }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Description:</label>
                                        <el-form-item prop="description">
                                            <el-input type="textarea" v-model="newProductForm.description" placeholder="Enter Description for your product" />
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="newProductFormVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="submitProductCreation"> Confirm </el-button>
                            </span>
                        </template>
                    </el-dialog>
                    <el-dialog v-model="viewProductDialogVisible" width="80%" left>
                        <template #header>
                            <div class="dialog-header">
                                <span v-if="editableMode" class="dialog-title">Edit Product Details</span>
                                <span v-else class="dialog-title">Product Details</span>
                                <div class="dialog-header-actions">
                                    <button type="button" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm btn-circle" @click="toggleEdit">
                                    <i class="ki-duotone ki-notepad-edit fs-3x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    </i>
                                    </button>                                  
                                    <i class="el-icon-close dialog-close-icon" @click="viewProductDialogVisible = false"></i>
                                </div>
                            </div>
                        </template>
                        <el-form ref="updateProductFormRef" :model="updateProduct" :rules="newProductFormRules">
                            <div class="mx-8">
                                <div class="row">
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Name:</label>
                                        <el-form-item prop="name">
                                            <el-input v-model="updateProduct.name" placeholder="Enter a name for your product" :disabled="!editableMode" />
                                        </el-form-item>
                                    </div>
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Currency:</label>
                                        <el-form-item prop="currency">
                                            <el-select placeholder="Select a currency this product is dealt in" style="background-color: #f4f4f4f4 !important;" v-model="updateProduct.currency" :disabled="!editableMode">
                                                <el-option v-for="(obj, _currency) in currencies" :key="_currency" :value="_currency" :label="`${obj.symbol} ${obj.long_name}`">{{ obj.symbol }} {{ obj.long_name }}</el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Unit:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item v-if="!updateProduct.is_unit_custom" prop="unit" class="w-100 me-3">
                                                <el-select placeholder="Select a unit this product is dealt in" style="background-color: #f4f4f4f4 !important;" v-model="updateProduct.unit" :disabled="!editableMode">
                                                    <el-option v-for="(obj, _unit) in units" :key="_unit" :value="_unit" :label="obj.display">{{ obj.display }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item v-else prop="unit_custom" class="w-100 me-3">
                                                <el-input v-model="updateProduct.unit_custom" placeholder="Enter your custom unit" :disabled="!editableMode" />
                                            </el-form-item>
                                            <el-form-item label="Custom Unit" prop="is_unit_custom">
                                                <el-switch v-model="updateProduct.is_unit_custom" :disabled="!editableMode" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-4 d-none d-sm-block"></div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Price excluding tax:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item prop="base_price" class="w-100 me-3">
                                                <el-input v-model="updateProduct.base_price" type="number" placeholder="Enter base price" step="1.00" :disabled="!editableMode" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-4 d-none d-sm-block"></div>
                                    <div class="col-lg-6 col-md-4 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Tax:</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item>
                                                <el-popover placement="top-start" trigger="hover" content="Price after tax">
                                                    <template #reference>
                                                        <el-input v-model="UpdatedNewPriceAfterTax" type="number" disabled class="me-3"></el-input>
                                                    </template>
                                                </el-popover>
                                            </el-form-item>
                                            <el-form-item prop="base_price" class="w-100 me-3">
                                                <el-input v-model="updateProduct.tax_rate" type="number" placeholder="Enter tax rate" step=".01" :disabled="!editableMode">
                                                    <template #suffix>%</template>
                                                </el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-8 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Status</label>
                                        <div class="d-flex w-100 justify-content-between">
                                            <el-form-item prop="status" class="w-100 me-3">
                                                <el-select placeholder="Select a status" style="background-color: #f4f4f4f4 !important;" v-model="updateProduct.status" :disabled="!editableMode">
                                                    <el-option v-for="(obj, _status) in status" :key="_status" :value="_status" :label="obj.label">{{ obj.label }}</el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-sm-12 mb-4">
                                        <label class="form-label fs-6 fw-semibold required">Description:</label>
                                        <el-form-item prop="description">
                                            <el-input type="textarea" v-model="updateProduct.description" placeholder="Enter Description for your product" :disabled="!editableMode" />
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                        <template #footer>
                            <span class="d-flex justify-content-between align-item-center px-7">
                                <div class="d-flex">
                                    <el-button type="danger" @click="deleteProduct">Delete</el-button>
                                </div>
                                <div class="d-flex">
                                    <el-button @click="viewProductDialogVisible = false">Cancel</el-button>
                                    <el-button type="primary" @click="updateProductCreation" :disabled="!editableMode"> Confirm </el-button>
                                </div>
                            </span>
                        </template>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElInput, ElForm, ElFormItem, ElDialog, ElButton, ElMessage } from 'element-plus';
import { useOptionsetStore } from '@/stores/optionsets';
import { useProductStore } from '@/stores/products';
import { useAccountsStore } from "@/stores/accounts";
import { BiArchive, BiArchiveFill,HiSolidArchive } from 'oh-vue-icons/icons';
import { reactive } from 'vue';
import ApiService from "@/core/services/ApiService";
import Swal from 'sweetalert2';

const productStore = useProductStore();
const optionsetStore = useOptionsetStore();
const accountStore = useAccountsStore();
const status = computed(() => productStore.statusOption);
const newProductFormRef = ref(null);
const updateProductFormRef = ref(null);
const newProductFormVisible = ref(false);
const isLoading = computed(() => productStore.loadingProducts);
const errorsRead = ref(true);
const selectedStatus =ref('');
let viewProductDialogVisible = ref(false);
const editableMode = ref(false);
const searchQuery = ref('');
const archiveToggleState = ref('N');
const toggleEdit =()=> {
    editableMode.value = !editableMode.value;
    console.log(editableMode.value)
}
const products = computed(() => productStore.products);
const currentAccount = computed(() => accountStore.currentAccount);
const selectedUpdateStatus = ref(null)
const selectedProducts = ref([]);
const updateSelectedStatus = async () => {
    if (selectedProducts.value.length <= 0) {
        ElMessage({
            message: 'Please select Product for update status.',
            type: 'warning'
        });
        return;
    }

    const newStatus = selectedUpdateStatus.value;
    if (!newStatus) {
        ElMessage({
            message: 'Please select a status to update.',
            type: 'warning'
        });
        return;
    }

    for (const product of selectedProducts.value) {
        if (product.status === newStatus) {
            ElMessage({
                message: 'Product already has the selected status.',
                type: 'warning'
            });
            continue; 
        }

        const originalStatus = product.status; 
        product.status = newStatus;
        selectedUpdateStatus.value = null;
        try {
            await ApiService.patch(`/api/v2/products/products/${product.id}/`, {
                status: newStatus,
                current_account: currentAccount.value.id
            });
            ElMessage({
                message: `Product ${product.name} status updated successfully.`,
                type: 'success'
            });
        } catch (error) {
            product.status = originalStatus; 
            ElMessage({
                message: `Failed to update status for product ${product.name}.`,
                type: 'error'
            });
        }
    }
};
const updateArchive = async () => {
    if (selectedProducts.value.length <= 0) {
        ElMessage({
            message: 'Please select Product for update status.',
            type: 'warning'
        });
        return;
    }

    for (const product of selectedProducts.value) {
        const newArchiveStatus = !product.is_archived;

        if (product.is_archived === newArchiveStatus) {
            ElMessage({
                message: `Product ${product.name} already has the selected archive status.`,
                type: 'warning'
            });
            continue; 
        }

        const originalArchived = product.is_archived; 
        product.is_archived = newArchiveStatus;

        try {
            await ApiService.patch(`/api/v2/products/products/${product.id}/`, {
                is_archived: newArchiveStatus,
                current_account: currentAccount.value.id
            });

            ElMessage({
                message: `Product ${product.name} has been ${newArchiveStatus ? 'archived' : 'unarchived'} successfully.`,
                type: 'success'
            });
        } catch (error) {
            product.is_archived = originalArchived; 
            ElMessage({
                message: `Failed to update archive status for product ${product.name}.`,
                type: 'error'
            });
        }
    }
};
const handleSelectionChange = (val) => {
    selectedProducts.value = val;
};
const currencies = optionsetStore.getCurrencies();
const units = optionsetStore.units;
const updatedProductid = ref(null);
const newProductForm = reactive({
    name: null,
    base_price: 0.00,
    tax_rate: 0.00,
    currency: null,
    status: null,
    unit: null,
    is_unit_custom: false,
    unit_custom: null,
    description: null
});
const toggleArchive = async (product) => {
    const newArchiveStatus = !product.is_archived;

    product.is_archived = newArchiveStatus;
    console.log("product patch ", product);

    ElMessage({
        message: `Product is being ${newArchiveStatus ? 'archived' : 'unarchived'}...`,
        type: 'info'
    });

    // Swal.fire({
    //     title: 'Loading...',
    //     text: 'Please wait while we update the product status.',
    //     icon: 'info',
    //     allowOutsideClick: false,
    //     showConfirmButton: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

    try {
        await ApiService.patch(`/api/v2/products/products/${product.id}/`, {
            is_archived: newArchiveStatus,
            current_account: currentAccount.value.id
        });

        // Swal.fire({
        //     title: 'Success!',
        //     text: `Product has been ${newArchiveStatus ? 'archived' : 'unarchived'} successfully.`,
        //     icon: 'success',
        //     timer: 2000,
        //     showConfirmButton: false
        // });

        ElMessage({
            message: `Product has been ${newArchiveStatus ? 'archived' : 'unarchived'} successfully.`,
            type: 'success'
        });

    } catch (error) {
        console.error("Error updating product's archive status:", error);

        // Reset the archive status
        product.is_archived = !newArchiveStatus;

        Swal.fire({
            title: 'Error!',
            text: 'An error occurred while updating the archive status.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });

        ElMessage({
            message: 'An error occurred while updating the archive status.',
            type: 'error'
        });
    }
};
const updateProduct = reactive({
    name: null,
    base_price: 0.00,
    tax_rate: 0.00,
    currency: null,
    status: null,
    unit: null,
    is_unit_custom: false,
    unit_custom: null,
    description: null
});
const handleRowClick = (row) => {
    Object.assign(updateProduct, {
        name: row.name,
        base_price: parseFloat(row.base_price),
        tax_rate: parseFloat(row.tax_rate),
        currency: row.currency,
        status: row.status,
        unit: row.unit,
        is_unit_custom: row.is_unit_custom,
        unit_custom: row.unit_custom,
        description: row.description
    });

    viewProductDialogVisible.value = true;
    updatedProductid.value = row.id; 
};

const newProductFormRules = computed(() => {return {
    name: [{ required: true, message: 'Please input product name', trigger: 'blur' }],
    base_price: [{ required: true, message: 'Please input base price', trigger: 'blur' }],
    currency: [{ required: true, message: 'Please select currency', trigger: 'change' }],
    status: [{ required: true, message: 'Please select status', trigger: 'change' }],
    unit: [{ required: true, message: 'Please select unit', trigger: 'change' }],
    unit_custom: [{ required: newProductForm.is_unit_custom, message: 'Please input custom unit', trigger: 'blur' }]
}});

const newPriceAfterTax = computed(() => {
    const basePrice = newProductForm.base_price;
    const taxRate = newProductForm.tax_rate;
    return basePrice + (basePrice * taxRate / 100);
});
const UpdatedNewPriceAfterTax = computed(() => {
    const basePrice = updateProduct.base_price;
    const taxRate = updateProduct.tax_rate;
    return basePrice + (basePrice * taxRate / 100);
});
onMounted(() => {
    productStore.fetchProducts();
});

const ruleForm = ref({
    name: '',
    currency: '',
    unit: '',
    base_price: '',
    tax_rate: 0,
    status: '',
    description: ''
});

const rules = {
    name: [{ required: true, message: 'Please input activity name', trigger: 'blur' }],
    currency: [{ required: true, message: 'Please select currency', trigger: 'change' }],
    Unit: [{ required: true, message: 'Please select unit', trigger: 'change' }],
    Price_excluding_tax: [{ required: true, message: 'Please input price excluding tax', trigger: 'blur' }],
    Tax: [{ required: true, message: 'Please input tax percentage', trigger: 'blur' }],
    Status: [{ required: true, message: 'Please select status', trigger: 'change' }],
    Description: [{ required: true, message: 'Please input description', trigger: 'blur' }]
};
const toggleArchiveList = () => {
  switch (archiveToggleState.value) {
    case 'N':
      archiveToggleState.value = 'A'; 
      break;
    case 'A':
      archiveToggleState.value = '_A'; 
      break;
    case '_A':
      archiveToggleState.value = 'N'; 
      break;
  }
};
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesStatus = selectedStatus.value.length === 0 || selectedStatus.value.includes(product.status);
    const matchesSearch = !searchQuery.value || 
                            product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesArchive = archiveToggleState.value === '_A' || 
                          (archiveToggleState.value === 'A' && product.is_archived) ||
                          (archiveToggleState.value === 'N' && !product.is_archived);

    return matchesStatus && matchesSearch && matchesArchive;
  });
});
const resetNewProductForm = () => {
    console.log('reset called')
    if (!newProductFormRef.value) return
    newProductFormRef.value.resetFields()
    console.log('form has been reset: ', newProductFormRef.value)
};
const resetUpdateProductForm = () => {
    if (!updateProductFormRef.value) return
    updateProductFormRef.value.resetFields()
    console.log('form has been reset: ', updateProductFormRef.value)
};
const submitProductCreation = async () => {
    isLoading.value = true;
    if (!newProductFormRef.value) {
        isLoading.value = false;
        return;
    }
    
    await newProductFormRef.value.validate((valid, fields) => {
        if (valid) {
            console.log("Validation passed: ", newProductForm);
            const newProductData = {
                ...newProductForm,
                current_account: currentAccount.value.id
            }
            console.log("newProductData : ", newProductData);
            newProductFormVisible.value = false;
            
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we process your request.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            ApiService.post("/api/v2/products/products/", newProductData).then((response) => {
                ElMessage({
                    message: 'Products created successfully',
                    type: 'success'
                });
                productStore.addProducts(response.data);
                ElMessage({
                    message: `Product "${response.data.name}" has been added to product list.`,
                    type: 'success'
                });
                resetNewProductForm();
                
                isLoading.value = false;

                Swal.fire({
                    title: 'Success!',
                    text: 'Product created successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

            }).catch((error) => {
                if (error.response && error.response.status === 400) {
                    errors.value = processErrors(error.response.data);
                    errorsRead.value = false;
                } else {
                    console.log('The following error has occurred: ', error);
                }
                isLoading.value = false;

                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while creating the product.',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
            });
        } else {
            ElMessage({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `<h6 class="text-danger mb-0">There are errors in your form!</h6>Please correct these errors before you submit the data.`,
                type: 'error'
            });
            isLoading.value = false;
        }
    });
};
const updateProductCreation = async () => {
    isLoading.value = true;
    if (!updateProductFormRef.value) {
        isLoading.value = false;
        return;
    }

    await updateProductFormRef.value.validate((valid, fields) => {
        if (valid) {
            console.log("Validation passed: ", updateProduct);
            const updateProductData = {
                ...updateProduct,
                current_account: currentAccount.value.id
            }
            console.log("updateProductData : ", updateProductData);
            
            viewProductDialogVisible.value = false;

            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we process your request.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            ApiService.put(`/api/v2/products/products/${updatedProductid.value}/`, updateProductData)
                .then((response) => {
                    console.log(response.data); // Log the response data to ensure the structure
                    ElMessage({
                        message: 'Products updated successfully',
                        type: 'success'
                    });

                    if (response.data && response.data.status) {
                        productStore.updateProduct(response.data);
                        ElMessage({
                            message: `Product "${response.data.name}" has been updated in the product list.`,
                            type: 'success'
                        });
                    } else {
                        console.warn("The response does not contain the expected product data.");
                    }

                    resetUpdateProductForm();
                    isLoading.value = false;

                    Swal.fire({
                        title: 'Success!',
                        text: 'Product Updated successfully.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        errors.value = processErrors(error.response.data);
                        errorsRead.value = false;
                        Swal.fire({
                            title: 'Error!',
                            text: 'An error occurred while Update the product.',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        });

                    } else {
                        console.error('The following error has occurred:', error);
                    }
                    isLoading.value = false;
                }
            );
        }
    });
};
const deleteProduct = async () => {
    isLoading.value = true;

    try {
        viewProductDialogVisible.value = false;
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we process your request.',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        await ApiService.delete(`/api/v2/products/products/${updatedProductid.value}/`)
            .then((response) => {
                console.log(response.data);
                
                ElMessage({
                    message: `Product deleted successfully.`,
                    type: 'success'
                });

                productStore.deleteProduct(updatedProductid.value);

                Swal.fire({
                    title: 'Success!',
                    text: 'Product Delete successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch((error) => {
                console.error('Error occurred while deleting the product:', error);
                
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while delete the product.',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                });

                ElMessage({
                    message: `Error occurred while deleting the product.`,
                    type: 'error'
                });
            });
    } finally {
        isLoading.value = false;
    }
};
</script>
<style scoped>
.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.dialog-title {
    font-size: 18px;
    font-weight: bold;
}
.dialog-header-actions {
    display: flex;
    align-items: center;
}
.edit-button {
    margin-right: 10px;
}
.dialog-close-icon {
    cursor: pointer;
    font-size: 20px;
}
</style>