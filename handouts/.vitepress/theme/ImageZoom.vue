<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
const dialog = ref(null), source = ref(''), alt = ref('');
let previous = null;
function open(image) {
  previous = image; source.value = image.src; alt.value = image.alt;
  nextTick(() => { dialog.value.showModal(); document.body.style.overflow = 'hidden'; });
}
function close() { dialog.value?.close(); }
function closed() { document.body.style.overflow = ''; previous?.focus(); }
function click(event) { const img = event.target.closest?.('.vp-doc img'); if (img) open(img); }
function key(event) { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches?.('.vp-doc img')) { event.preventDefault(); open(event.target); } }
function prepare() { document.querySelectorAll('.vp-doc img:not([tabindex])').forEach(img => { img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', `放大图片：${img.alt || '笔记插图'}`); }); }
let observer;
onMounted(() => { prepare(); observer = new MutationObserver(prepare); observer.observe(document.querySelector('#app'), { childList: true, subtree: true }); document.addEventListener('click', click); document.addEventListener('keydown', key); });
onUnmounted(() => { observer?.disconnect(); document.removeEventListener('click', click); document.removeEventListener('keydown', key); document.body.style.overflow = ''; });
</script>
<template>
  <dialog ref="dialog" class="image-dialog" aria-label="图片预览" @close="closed" @click="event => { if (event.target === dialog) close(); }">
    <button class="zoom-close" @click="close" autofocus>关闭 ×</button>
    <img :src="source || undefined" :alt="alt" />
    <p>{{ alt }}</p>
  </dialog>
</template>
<style scoped>
.image-dialog{position:fixed;inset:0;margin:auto;max-width:95vw;max-height:94vh;padding:56px 20px 20px;border:0;border-radius:12px;color:var(--vp-c-text-1);background:var(--vp-c-bg)}.image-dialog::backdrop{background:rgba(0,0,0,.82)}.image-dialog img{max-width:88vw;max-height:75vh;object-fit:contain;background:white}.image-dialog p{text-align:center;font-size:13px;margin-top:12px}.zoom-close{position:absolute;right:20px;top:16px;padding:4px 12px;border:1px solid var(--vp-c-divider);border-radius:4px;cursor:pointer}
</style>
