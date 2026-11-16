import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { courses } from '../courses.mjs';
const origin=process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4189';
const shots=(process.env.TEMP || '.')+'/cryself-book-layout';
await mkdir(shots,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const p=await browser.newPage({viewport:{width:1600,height:1050},reducedMotion:'reduce'});
const failures=[];
p.on('pageerror',e=>failures.push(e.message));
p.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url())});
async function width(){assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'横向溢出 '+p.url())}
try {
for(const course of courses) {
 await p.goto(origin+course.link(),{waitUntil:'networkidle'});
 assert.ok(await p.locator('.VPSidebar').isVisible());
 assert.equal(await p.locator('.landing-hero h1').innerText(),course.title);
 assert.equal(await p.locator('.landing-features>div').count(),3);
 assert.equal(await p.locator('.landing-directory li').count(),course.chapters.length);
 assert.equal(await p.locator('.return-blog').getAttribute('href'),'/');
 await width();
 await p.screenshot({path:shots+'/'+course.id+'-home.png'});
 for(const chapter of course.chapters) {
  await p.goto(origin+course.link('notes/'+chapter.slug),{waitUntil:'networkidle'});
  const data=await p.evaluate(()=>({
   headings:[...document.querySelectorAll('.vp-doc h2,.vp-doc h3,.vp-doc h4,.vp-doc h5,.vp-doc h6')].map(h=>({id:h.id,text:h.textContent,number:h.getAttribute('data-section-number')})),
   links:[...document.querySelectorAll('.course-section-nav a')].map(a=>({text:a.textContent,target:document.getElementById(decodeURIComponent(a.hash.slice(1)))?.getAttribute('data-section-number')})),
   font:getComputedStyle(document.querySelector('.vp-doc')).fontSize,
   images:[...document.querySelectorAll('.vp-doc img')].filter(i=>!i.complete||!i.naturalWidth).length,
  }));
  assert.equal(await p.locator('.chapter-meta,.VPDocAsideOutline').count(),0);
  assert.equal(data.font,'20px');
  assert.ok(data.headings.length>0);
  assert.ok(data.headings.every(h=>h.number&&!/[：:]/.test(h.text)),chapter.slug+' 标题编号或冒号');
  assert.equal(data.links.length,await p.locator('.vp-doc h2').count(),chapter.slug+' 初始只展示一级小节');
  assert.ok(data.links.every(l=>l.target && l.text.startsWith(l.target+' ')),chapter.slug+' 目录标题不一致');
  assert.equal(data.images,0);
  assert.equal(await p.locator('mjx-merror,[data-mjx-error]').count(),0);
  await width();
 }
 console.log(course.title+' 首页、全部章节、标题编号、目录、公式和图片通过');
}
await p.goto(origin+'/linear-algebra/notes/solving-linear-systems',{waitUntil:'networkidle'});
await p.evaluate(()=>document.documentElement.classList.add('dark'));
await p.screenshot({path:shots+'/linear-reading-dark.png'});
const roots=p.locator('.course-section-nav>.section-branches>li');
const first=roots.nth(1), second=roots.nth(2);
await first.locator(':scope>.section-row>a').click();
assert.equal(await first.locator(':scope>.section-branches').count(),1);
await second.locator(':scope>.section-row>a').click();
assert.equal(await first.locator(':scope>.section-branches').count(),0);
assert.equal(await second.locator(':scope>.section-branches').count(),1);
const nested=second.locator(':scope>.section-branches>li').nth(1);
await nested.locator(':scope>.section-row>a').click();
assert.equal(await second.locator(':scope>.section-branches').count(),1);
assert.equal(await nested.locator(':scope>.section-branches').count(),1);
const otherNested=second.locator(':scope>.section-branches>li').nth(3);
await otherNested.locator(':scope>.section-row>a').click();
assert.equal(await nested.locator(':scope>.section-branches').count(),0);
assert.equal(await otherNested.locator(':scope>.section-branches').count(),1);
await p.screenshot({path:shots+'/linear-accordion.png'});
await second.locator(':scope>.section-row>button').click();
assert.equal(await second.locator(':scope>.section-branches').count(),0);
const section=p.locator('.course-section-nav>.section-branches>li>.section-row>a').first();
const sectionHash=await section.getAttribute('href');
await section.click();
await p.waitForFunction(hash=>document.querySelector('.course-section-nav .section-row.active a')?.getAttribute('href')===hash,sectionHash);
await p.getByRole('button',{name:'搜索讲义',exact:true}).click();
await p.locator('#localsearch-input').fill('秩一矩阵');
await p.locator('.VPLocalSearchBox .results a').first().waitFor({state:'visible'});
await p.keyboard.press('Escape');
for(const size of [{width:390,height:844},{width:320,height:700}]) {
 await p.setViewportSize(size);
 for(const course of courses) {
  for(const path of ['', 'notes/'+course.chapters.at(-1).slug]) {
   await p.goto(origin+course.link(path),{waitUntil:'networkidle'});await width();
  }
 }
}
await p.setViewportSize({width:390,height:844});
await p.goto(origin+'/linear-algebra/notes/solving-linear-systems',{waitUntil:'networkidle'});
assert.equal(await p.locator('.vp-doc').evaluate(e=>getComputedStyle(e).fontSize),'19px');
await p.getByRole('button',{name:'章节目录',exact:true}).click();
assert.ok(await p.locator('.VPSidebar.open').isVisible());
assert.equal(await p.locator('.VPLocalNavOutlineDropdown button').innerText(),'回到顶部');
await p.locator('.course-section-nav>.section-branches>li>.section-row>a').first().click();
await p.locator('.VPSidebar.open').waitFor({state:'hidden'});
await p.screenshot({path:shots+'/linear-mobile.png'});
assert.deepEqual(failures,[]);
console.log('滚动定位、全文搜索、手机目录、320/390px 布局通过。截图：'+shots);
} finally {await browser.close();}
