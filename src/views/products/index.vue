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
                                <button type="button" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm btn-circle" @click="toggleEditMode">
                                    <i class="ki-duotone ki-notepad-edit fs-3x">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </button>
                                <button class="btn btn-success ms-3 btn-sm rounded" @click="newProductFormVisible = true">New Product</button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex px-5 mt-15">
                        <div class="d-flex w-100 justify-content-end">
                            <div class="d-flex">
                                <el-form data-kt-search-element="form"
                                    class="d-none w-350px d-lg-block position-relative mb-5 mb-lg-0" autocomplete="off">
                                    <input type="hidden">
                                    <i class="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-5"></i>
                                    <input type="text"
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
                            <div class="d-flex">
                                <el-select v-model="selectedStatus" placeholder="Status" size="large"
                                    class="w-150px ms-3" clearable multiple>
                                    <el-option v-for="(item, key) in statusOption" :key="key"
                                        :label="`${item.label} ${item.value}`" :value="key" />
                                </el-select>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex w-100 px-5 py-5">
                        <div class="d-flex w-100 g-5 g-xl-10">
                            <div class="w-100">
                                <div class="card card-flush h-xl-100">
                                    <div class="card-body pt-2">
                                        <div id="kt_table_widget_4_table_wrapper"
                                            class="dt-container dt-bootstrap5 dt-empty-footer">
                                            <div class="table-responsive">
                                                <table class="table align-middle table-row-dashed fs-6 gy-3 dataTable"
                                                    id="kt_table_widget_4_table" style="width: 100%;">
                                                    <colgroup>
                                                        <col style="width: 90px;">
                                                        <col style="width: 115px;">
                                                        <col style="width: 144px;">
                                                        <col style="width: 115px;">
                                                        <col style="width: 115px;">
                                                        <col style="width: 125px;">
                                                        <col style="width: 40px;">
                                                    </colgroup>
                                                    <thead>
                                                        <tr
                                                            class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                                            <th class="min-w-80px">#</th>
                                                            <th class="min-w-80px">Order ID</th>
                                                            <th class="min-w-80px">Created</th>
                                                            <th class="min-w-80px">Customer</th>
                                                            <th class="min-w-80px">Total</th>
                                                            <th class="min-w-80px">Profit</th>
                                                            <th class="min-w-80px">Status</th>
                                                            <th class=""></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="fw-bold text-gray-600">
                                                        <tr>
                                                            <td>1</td>
                                                            <td>
                                                                <a href="#"
                                                                    class="text-gray-800 text-hover-primary">#SKP-567</a>
                                                            </td>
                                                            <td>7 min ago</td>
                                                            <td>
                                                                <a href="#" class="text-gray-600 text-hover-primary">Dan
                                                                    Wilson</a>
                                                            </td>
                                                            <td>$590.00</td>
                                                            <td>
                                                                <span class="text-gray-800 fw-bolder">$50.00</span>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    class="badge py-3 px-4 fs-7 badge-light-success">Shipped</span>
                                                            </td>
                                                            <td>
                                                                <button type="button"
                                                                    class="btn btn-sm btn-icon btn-light btn-active-light-primary toggle h-25px w-25px">
                                                                    <i
                                                                        class="ki-duotone ki-plus fs-4 m-0 toggle-off"></i>
                                                                    <i
                                                                        class="ki-duotone ki-minus fs-4 m-0 toggle-on"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="row">
                                                <div
                                                    class="col-sm-12 col-md-5 d-flex align-items-center justify-content-md-start">
                                                </div>
                                                <div
                                                    class="col-sm-12 col-md-7 d-flex align-items-center justify-content-md-end">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                            <el-form-item v-else prop="custom_unit" class="w-100 me-3">
                                                <el-input v-model="newProductForm.custom_unit" placeholder="Enter your custom unit" />
                                            </el-form-item>
                                            <el-form-item label="Custom Unit" prop="is_unit_custom">
                                                <el-switch v-model="newProductForm.is_unit_custom" />
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="show = false">Cancel</el-button>
                                <el-button type="primary" @click="show = false"> Confirm </el-button>
                            </span>
                        </template>
                    </el-dialog>

                    <el-dialog v-model="dialogFormVisible" width="700">
                        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
                            <h1 class="display-7 py-8">Create New Product</h1>

                            <!-- Activity Name -->
                            <el-form-item label="Activity Name" prop="name">
                                <el-input v-model="ruleForm.name" />
                            </el-form-item>

                            <!-- Currency -->
                            <el-form-item label="Currency" prop="Currency">
                                <el-select v-model="ruleForm.Currency" placeholder="Select Currency">
                                    <el-option v-for="(currency, key) in currencies" :key="key" :label="currency"
                                        :value="key" />
                                </el-select>
                            </el-form-item>

                            <!-- Unit with Add Option -->
                            <el-form-item label="Unit" prop="Unit">
                                <el-select v-model="ruleForm.Unit" placeholder="Select Unit">
                                    <el-option v-for="(unit, index) in units" :key="index" :label="unit"
                                        :value="unit" />
                                    <template #footer>
                                        <el-input v-if="isAddingUnit" v-model="newUnit" size="small"
                                            placeholder="Input new unit" />
                                        <el-button v-if="isAddingUnit" @click="addUnit">Add</el-button>
                                        <el-button v-else @click="isAddingUnit = true">Add New Unit</el-button>
                                    </template>
                                </el-select>
                            </el-form-item>

                            <!-- Price Excluding Tax -->
                            <el-form-item label="Excluding Tax" prop="Price_excluding_tax">
                                <el-input v-model.number="ruleForm.Price_excluding_tax" type="number" />
                            </el-form-item>

                            <!-- Tax -->
                            <el-form-item label="Tax" prop="Tax">
                                <el-input v-model.number="ruleForm.Tax" type="number" />
                            </el-form-item>

                            <!-- Price Including Tax (Disabled and auto-calculated) -->
                            <el-form-item label="Including Tax" prop="Price_including_tax">
                                <el-input :value="priceIncludingTax" disabled />
                            </el-form-item>

                            <!-- Status -->
                            <el-form-item label="Status" prop="Status">
                                <el-select v-model="ruleForm.Status" placeholder="Select Status">
                                    <el-option v-for="(status, key) in statusOption" :key="key" :label="status.label"
                                        :value="key" />
                                </el-select>
                            </el-form-item>

                            <!-- Description -->
                            <el-form-item label="Description" prop="Description">
                                <el-input type="textarea" v-model="ruleForm.Description" />
                            </el-form-item>

                            <span class="d-flex justify-content-end">
                                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="submitForm">Submit</el-button>
                            </span>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElInput, ElForm, ElFormItem, ElDialog, ElButton } from 'element-plus';
import { useOptionsetStore } from '@/stores/optionsets';
import { useProductStore } from '@/stores/products';
import { reactive } from 'vue';

const productStore = useProductStore();
const optionsetStore = useOptionsetStore();
const newProductFormRef = ref(null);
const newProductFormVisible = ref(false);

const currencies = optionsetStore.getCurrencies();

const newProductForm = reactive({
    name: null,
    base_price: 0.0,
    tax_rate: 0.0,
    currency: null,
    status: null,
    unit: null,
    is_unit_custom: false,
    unit_custom: null,
    description: null
});

const newProductFormRules = computed(() => {return {
    name: [{ required: true, message: 'Please input product name', trigger: 'blur' }],
    base_price: [{ required: true, message: 'Please input base price', trigger: 'blur' }],
    currency: [{ required: true, message: 'Please select currency', trigger: 'change' }],
    status: [{ required: true, message: 'Please select status', trigger: 'change' }],
    unit: [{ required: true, message: 'Please select unit', trigger: 'change' }],
    unit_custom: [{ required: newProductForm.is_unit_custom, message: 'Please input custom unit', trigger: 'blur' }]
}});

onMounted(() => {
    productStore.fetchProducts();
});

// Data
const dialogFormVisible = ref(false);
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

const units = ['Unit1', 'Unit2'];
const isAddingUnit = ref(false);
const newUnit = ref('');

const statusOption = {
    pending: { label: 'Pending' },
    active: { label: 'Active' },
    expired: { label: 'Expired' }
};

const priceIncludingTax = computed(() => {
    const price = ruleForm.value.Price_excluding_tax;
    const tax = ruleForm.value.Tax;
    return price * (1 + tax / 100);
});

const addUnit = () => {
    units.push(newUnit.value);
    newUnit.value = '';
    isAddingUnit.value = false;
};

const submitForm = () => {
    console.log('Form Submitted:', ruleForm.value);
    dialogFormVisible.value = false;
};
</script>