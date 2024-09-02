<template>
    
</template>
<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    export default defineComponent({
        setup() {
            const route = useRoute();
            const router = useRouter();
        }
    });
</script>