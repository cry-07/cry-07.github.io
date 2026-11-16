<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useData, withBase } from 'vitepress';
import CourseHeadingBranch from './CourseHeadingBranch.vue';
const { page, theme } = useData();
const activeId=ref('');
const groups=computed(()=>Array.isArray(theme.value.sidebar)?theme.value.sidebar:[]);
const current=link=>page.value.relativePath.replace(/\.md$/,'')===link.replace(/^\//,'');
const headings=computed(()=> {
  const flatten=items=>items.flatMap(h=>[{...h,children:undefined},...flatten(h.children || [])]);
  return flatten(page.value.headers || []);
});
let frame;
function track() {
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{
    let active='';
    for(const h of headings.value) {
      const el=document.getElementById(h.slug);
      if(el && el.getBoundingClientRect().top<=120) active=h.slug;
    }
    activeId.value=active;
  });
}
function closeMobile(heading) {
  if(heading.children?.length) return;
  if(window.innerWidth<960) nextTick(()=>document.querySelector('.VPBackdrop')?.click());
}
onMounted(()=>{window.addEventListener('scroll',track,{passive:true});track();});
onUnmounted(()=>{window.removeEventListener('scroll',track);cancelAnimationFrame(frame);});
watch(()=>page.value.relativePath,()=>{activeId.value='';nextTick(track);});
</script>
<template>
  <div class="course-sidebar">
    <a class="course-index-link" :href="withBase('/')" :aria-current="page.relativePath==='index.md'?'page':undefined">专题首页</a>
    <section v-for="group in groups" :key="group.text" class="course-nav-group">
      <h2>{{ group.text }}</h2>
      <div v-for="item in group.items" :key="item.link" class="course-nav-chapter">
        <a class="course-chapter-link" :class="{current:current(item.link)}" :href="withBase(item.link)" :aria-current="current(item.link)?'page':undefined">{{ item.text }}</a>
        <nav v-if="current(item.link)" aria-label="本章小节" class="course-section-nav">
          <CourseHeadingBranch :key="page.relativePath" :items="page.headers" :active-id="activeId" @navigate="closeMobile" />
        </nav>
      </div>
    </section>
  </div>
</template>
<style scoped>
.course-sidebar{padding:12px 0 30px}.course-index-link{display:block;font-size:16px;font-weight:600;padding:8px 0 20px}.course-nav-group{border-top:1px solid var(--vp-c-divider);padding:20px 0 12px}.course-nav-group h2{font-size:16px;font-weight:600;margin:0 0 12px}.course-chapter-link{display:block;font-size:15px;line-height:1.7;padding:7px 0;color:var(--vp-c-text-2);overflow-wrap:anywhere}.course-chapter-link.current{color:var(--vp-c-brand-1);font-weight:600}.course-section-nav{border-left:1px solid var(--vp-c-divider);margin:5px 0 14px 4px}a:hover{color:var(--vp-c-brand-1)}
</style>
