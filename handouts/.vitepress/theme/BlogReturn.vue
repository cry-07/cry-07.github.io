<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
const { site } = useData();
const blog = computed(() => site.value.base.replace(/(?:numerical-methods|crypto-handouts)\/$/, ''));
</script>
<template><a :href="blog" target="_self" class="return-blog">返回博客 ↗</a></template>
