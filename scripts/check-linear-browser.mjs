import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin=process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4188';
const shots=process.env.SCREENSHOT_DIR || process.env.TEMP+'/cryself-linear-preview';
await mkdir(shots,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400) errors.push(r.status()+' '+r.url());});
try {
for(const width of [1440,768,390]) {
 await page.setViewportSize({width,height:1050});
 await page.goto(origin,{waitUntil:'networkidle'});
 assert.equal(await page.locator('.context-column .course-card').count(),3);
 assert.equal(await page.locator('.feed-column .course-card,.feed-column .featured-course,.desk-card,.reading-route,.topic-list').count(),0);
 assert.equal(await page.locator('.entry:visible').count(),19);
 const positions=await page.evaluate(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,w:b.width}};return {feed:r('.feed-column'),courses:r('.context-column'),width:document.documentElement.scrollWidth,viewport:innerWidth}});
 assert.ok(positions.width<=width+1,JSON.stringify(positions));
 if(width===1440) assert.ok(positions.courses.x>positions.feed.x+positions.feed.w);
 assert.ok(await page.locator('.context-column').isVisible());
 await page.locator('#entry-search').fill('线性代数');
 assert.equal(await page.locator('.entry:visible').count(),2);
 await page.locator('#entry-search').fill('');
 await page.locator('[data-filter="articles"]').click();
 assert.ok(await page.locator('#empty-state').isVisible());
 await page.locator('#clear-filters').click();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 await page.evaluate(()=>window.scrollTo(0,document.querySelector('.home-grid').offsetTop));
 await page.screenshot({path:shots+'/home-'+width+'.png'});
 console.log('首页布局、专题入口、搜索分类通过：'+width);
}
await page.setViewportSize({width:1600,height:1050});
for(const slug of ['vectors-and-matrices','solving-linear-systems']) {
 await page.goto(origin+'/linear-algebra/notes/'+slug,{waitUntil:'networkidle'});
 assert.ok(await page.locator('.VPSidebar').isVisible());
 assert.equal(await page.locator('.VPDocAsideOutline').count(),0);
 assert.ok(await page.locator('.course-section-nav').isVisible());
 assert.equal(await page.locator('h1').count(),1);
 assert.ok(await page.locator('mjx-container').count()>50);
 assert.equal(await page.locator('[data-mjx-error],mjx-merror').count(),0);
 const anchors=await page.locator('.course-section-nav a').evaluateAll(links=>links.map(l=>l.getAttribute('href')).filter(h=>!document.getElementById(decodeURIComponent(h.slice(1)))));
 assert.deepEqual(anchors,[]);
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 await page.screenshot({path:shots+'/'+slug+'.png'});
}
await page.getByRole('button',{name:'搜索讲义',exact:true}).click();
await page.locator('#localsearch-input').fill('秩一矩阵');
await page.locator('.VPLocalSearchBox .results a').first().waitFor({state:'visible'});
await page.keyboard.press('Escape');
await page.setViewportSize({width:390,height:844});
await page.goto(origin+'/linear-algebra/notes/solving-linear-systems',{waitUntil:'networkidle'});
assert.ok(await page.getByRole('button',{name:'章节目录'}).isVisible());
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await page.screenshot({path:shots+'/note-mobile.png'});
for(const [old,slug] of [['01-vectors-and-matrices','vectors-and-matrices'],['02-solving-linear-systems','solving-linear-systems']]) {
 await page.goto(origin+'/posts/linear-algebra-'+old+'/',{waitUntil:'networkidle'});
 await page.waitForURL('**/linear-algebra/notes/'+slug,{timeout:15000});
}
assert.deepEqual(errors,[]);
console.log('讲义样式、公式、目录、搜索、移动端与旧链接跳转全部通过。截图：'+shots);
} finally { await browser.close(); }
