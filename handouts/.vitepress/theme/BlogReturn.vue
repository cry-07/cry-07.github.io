<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
const { site } = useData();
const blog = computed(() => site.value.base.replace(/numerical-methods\/$/, ''));
</script>
<template><a :href="blog" class="return-blog">返回博客 ↗</a></template>
