<script setup>
import { useData, withBase } from 'vitepress';
const { theme } = useData();
</script>
<template>
  <div class="course-landing">
    <section class="landing-hero">
      <div class="landing-art" aria-hidden="true">
        <svg v-if="theme.course.kind==='numerical'" viewBox="0 0 240 150"><g stroke="currentColor" opacity=".15"><path d="M15 40H225M15 80H225M15 120H225M40 10V140M80 10V140M120 10V140M160 10V140M200 10V140"/></g><path d="M20 124C55 124 53 28 87 40S128 135 162 79 193 27 221 35" fill="none" stroke="currentColor" stroke-width="3"/><path d="m60 138 126-120" stroke="currentColor" stroke-dasharray="4 5" opacity=".5"/><circle cx="127" cy="74" r="5" fill="currentColor"/></svg>
        <svg v-else-if="theme.course.kind==='crypto'" viewBox="0 0 240 150"><rect x="67" y="61" width="106" height="75" rx="9" fill="none" stroke="currentColor" stroke-width="3"/><path d="M89 61V42a31 31 0 0 1 62 0v19" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="120" cy="94" r="7" fill="currentColor"/><path d="M120 99v16" stroke="currentColor" stroke-width="4"/><path d="M22 45h30M188 45h30M22 109h30M188 109h30" stroke="currentColor" opacity=".3"/></svg>
        <svg v-else viewBox="0 0 240 150"><path d="M45 123h155M70 140V14" stroke="currentColor" opacity=".3"/><path d="M70 123 169 42M70 123 197 102" fill="none" stroke="currentColor" stroke-width="3"/><path d="m155 46 14-4-5 14m19 39 14 7-15 4" fill="none" stroke="currentColor" stroke-width="3"/><path d="m70 123 27-89 99 21-27 89Z" fill="currentColor" opacity=".08"/><path d="m97 34 99 21-27 89" fill="none" stroke="currentColor" stroke-dasharray="4 5" opacity=".5"/></svg>
      </div>
      <h1>{{ theme.course.title }}</h1>
      <p class="landing-description">{{ theme.course.description }}</p>
      <a class="landing-start" :href="withBase(theme.course.start)">开始学习 →</a>
    </section>
    <section class="landing-features" aria-label="专题介绍">
      <div v-for="feature in theme.course.features" :key="feature.title"><h2>{{ feature.title }}</h2><p>{{ feature.text }}</p></div>
    </section>
    <section class="landing-directory" aria-label="课程目录"><h2>课程目录</h2>
      <div v-for="group in theme.sidebar" :key="group.text" class="landing-group"><h3>{{ group.text }}</h3><ul><li v-for="item in group.items" :key="item.link"><a :href="withBase(item.link)">{{ item.text }} <span>→</span></a></li></ul></div>
    </section>
  </div>
</template>
<style scoped>
.course-landing{max-width:940px;margin:auto}.landing-hero{text-align:center;padding:20px 0 60px}.landing-art{color:var(--vp-c-brand-1);width:230px;margin:0 auto 28px}.landing-art svg{display:block;width:100%;height:auto}.landing-hero h1{font-family:var(--vp-font-family-base);font-size:42px;font-weight:650;letter-spacing:.02em;margin:0 0 22px}.landing-description{font-size:22px;line-height:1.85;color:var(--vp-c-text-2);max-width:660px;margin:0 auto 30px}.landing-start{display:inline-block;background:var(--vp-c-brand-3);color:white;text-decoration:none;border-radius:5px;padding:12px 26px;font-size:18px;font-weight:500}.landing-start:hover{background:var(--vp-c-brand-2)}.landing-features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;padding:32px 0 38px;border-top:1px solid var(--vp-c-divider);border-bottom:1px solid var(--vp-c-divider)}.landing-features h2{border:0;padding:0;margin:0 0 14px;font-size:22px;line-height:1.6}.landing-features p{font-size:17px;line-height:1.85;color:var(--vp-c-text-2);margin:0}.landing-directory{padding:15px 0 24px}.landing-directory>h2{border:0;margin-top:32px;padding-top:0;font-size:26px}.landing-group h3{font-size:19px;margin-top:28px}.landing-group ul{padding:0;list-style:none}.landing-group li{margin:0;border-bottom:1px solid var(--vp-c-divider)}.landing-group a{display:flex;justify-content:space-between;gap:16px;text-decoration:none;padding:12px 0;font-size:18px}.landing-group a span{color:var(--vp-c-text-2)}@media(max-width:767px){.landing-hero{padding:12px 0 38px}.landing-art{width:180px}.landing-hero h1{font-size:34px}.landing-description{font-size:20px}.landing-features{grid-template-columns:1fr;gap:24px}.landing-features p{font-size:18px}}
</style>
