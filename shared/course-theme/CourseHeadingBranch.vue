<script setup>
import { ref } from 'vue';
const props=defineProps({items:{type:Array,default:()=>[]},activeId:String,depth:{type:Number,default:0}});
const emit=defineEmits(['navigate']);
const openSlug=ref('');
function select(item) {
  openSlug.value=item.children?.length ? (openSlug.value===item.slug?'':item.slug) : '';
  emit('navigate',item);
}
</script>
<template>
  <ul class="section-branches">
    <li v-for="item in props.items" :key="item.slug">
      <div class="section-row" :class="{active:props.activeId===item.slug}">
        <a :href="'#'+item.slug" :aria-current="props.activeId===item.slug?'location':undefined" :aria-expanded="item.children?.length ? openSlug===item.slug : undefined" @click="select(item)">{{ item.title }}</a>
        <button v-if="item.children?.length" :aria-label="(openSlug===item.slug?'收起':'展开')+item.title" :aria-expanded="openSlug===item.slug" @click="openSlug=openSlug===item.slug?'':item.slug"><span :class="{expanded:openSlug===item.slug}">›</span></button>
      </div>
      <CourseHeadingBranch v-if="item.children?.length && openSlug===item.slug" :items="item.children" :active-id="props.activeId" :depth="props.depth+1" @navigate="emit('navigate',$event)" />
    </li>
  </ul>
</template>
<style scoped>
.section-branches{list-style:none;padding:0;margin:0}.section-branches .section-branches{padding-left:12px}.section-row{display:flex;align-items:flex-start;border-radius:3px}.section-row a{display:block;flex:1;min-width:0;padding:6px 6px 6px 12px;font-size:13px;line-height:1.65;color:var(--vp-c-text-2);overflow-wrap:anywhere}.section-row.active{box-shadow:-2px 0 0 var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}.section-row.active a,.section-row a:hover{color:var(--vp-c-brand-1)}.section-row button{flex:none;width:28px;min-height:33px;display:grid;place-items:center;color:var(--vp-c-text-2);border-radius:3px}.section-row button:hover{background:var(--vp-c-default-soft)}.section-row button span{display:block;font-size:20px;transition:transform .15s}.section-row button span.expanded{transform:rotate(90deg)}
</style>
