<template>
  <DataTable :tableHeader="tableHeader" />
</template>
<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in tableHeader" :key="header.columnLabel">
          {{ header.coloumnName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Table body content goes here -->
    </tbody>
  </table>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { defineProps } from 'vue';


export default defineComponent({
  name: "Datatable",
  
  setup() {
    const tableHeader = [
      {
        columnName: "Name",
        columnLabel: "name",
      },
      {
        columnName: "Position",
        columnLabel: "position",
      },
      {
        columnName: "Office",
        columnLabel: "office",
      },
      {
        columnName: "Age",
        columnLabel: "age",
      },
      {
        columnName: "Start date",
        columnLabel: "startDate",
      },
      {
        columnName: "Salary",
        columnLabel: "salary",
      },
    ];
    

    const props = defineProps({
      tableHeader: {
        type: Array,
        required: true,
      },
    });
    const loading = ref(false);

    return {
      tableHeader,
      props,
      loading
    };
  },
});
</script>