<template>
    <el-table :data="tableData" :style="{ width: '100%' }" class="rounded">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>
</template>
    
<script lang="ts">
    import { defineComponent } from 'vue';
    import { getAssetPath } from "@/core/helpers/assets";
    export default defineComponent({
        name: 'ChangeListTable',
        props: {
            tableData: {
                type: Array,
                required: true,
            },
            headings: {
                type: Array,
                required: true,
            },
        },
        setup() {
            return {
                getAssetPath,
            };
        },
    });
</script>
    
<style scoped>
    #kt_app_header {
      height: 80px; /* Adjust height as needed */
      z-index: 1000;
    }
</style>
    