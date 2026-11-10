import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { cryptoChapters } from '../crypto-chapters.mjs';
import { base, cryptoHref, notesHref } from '../site.config.mjs';
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173';
const shots = process.env.SCREENSHOT_DIR || '../../work/crypto-check';
await mkdir(shots,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH || (process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
const page = await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce'});
const errors=[],failed=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
async function width(label){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' 页面横向溢出');}
try{
  await page.goto(origin+base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.entry').count(),17);
  await page.locator('#entry-search').fill('密码学');assert.equal(await page.locator('.entry:visible').count(),8);
  await page.locator('.crypto-course-link').click();await page.waitForURL('**/crypto-handouts/');
  assert.equal(await page.locator('.VPFeature').count(),8);await width('讲义首页');
  assert.equal(await page.locator('.return-blog').getAttribute('href'),base);
  await page.screenshot({path:shots+'/crypto-home-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'搜索讲义',exact:true}).click();
  await page.locator('#localsearch-input').fill('混合');
  await page.locator('.VPLocalSearchBox .results a').first().waitFor({state:'visible',timeout:15000});
  await page.keyboard.press('Escape');results.push('首页入口、8 篇搜索结果及讲义全文搜索通过');
  let images=0,formulas=0;
  for(const chapter of cryptoChapters){
    await page.goto(origin+cryptoHref('notes/'+chapter.slug),{waitUntil:'networkidle'});
    await width(chapter.slug);
    assert.equal((await page.locator('h1').first().innerText()).replace(/\u200B/g,'').trim(),chapter.title);
    const f=await page.locator('.vp-doc mjx-container').count();assert.ok(f>10,chapter.slug+' 未渲染公式');formulas+=f;
    assert.equal(await page.locator('mjx-merror,[data-mjx-error]').count(),0,chapter.slug+' 公式错误');
    assert.equal(await page.locator('.vp-doc').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('mjx-container,code,script,style').forEach(n=>n.remove());return (copy.textContent.match(/\$/g)||[]).length}),0,chapter.slug+' 公式标记残留');
    const imgs=page.locator('.vp-doc img');images+=await imgs.count();
    assert.equal(await imgs.evaluateAll(items=>items.filter(i=>!i.complete||!i.naturalWidth).length),0,chapter.slug+' 图片未加载');
  }
  assert.equal(images,27);results.push(`8 篇讲义、${images} 处图片、${formulas} 处公式通过`);
  await page.goto(origin+cryptoHref('notes/proof-methods'),{waitUntil:'networkidle'});
  assert.equal(await page.locator('.vp-doc a[href$="/perfect-secrecy"]').count(),1);
  await page.locator('.vp-doc a[href$="/perfect-secrecy"]').click();await page.waitForURL('**/notes/perfect-secrecy');
  const img=page.locator('.vp-doc img').first();await img.focus();await page.keyboard.press('Enter');await page.locator('dialog[open]').waitFor({state:'visible'});await page.keyboard.press('Escape');assert.ok(await img.evaluate(el=>el===document.activeElement));
  const theme=page.locator('.VPNavBarAppearance button');await theme.click();assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
  await page.screenshot({path:shots+'/crypto-reading-dark.png'});
  await page.locator('.return-blog').click();await page.waitForURL(origin+base);assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));await page.locator('#theme-toggle').click();
  results.push('章节交叉链接、键盘图片放大、共享主题、返回博客通过');
  for(const size of [{width:390,height:844},{width:320,height:700}]){
    await page.setViewportSize(size);
    for(const slug of ['','notes/block-ciphers','notes/proof-methods','notes/midterm-2025']){await page.goto(origin+cryptoHref(slug),{waitUntil:'networkidle'});await width(size.width+' '+slug);}
  }
  await page.setViewportSize({width:390,height:844});await page.goto(origin+cryptoHref('notes/block-ciphers'),{waitUntil:'networkidle'});
  await page.screenshot({path:shots+'/crypto-reading-mobile.png'});
  await page.getByRole('button',{name:'章节目录',exact:true}).click();assert.ok(await page.locator('.VPSidebar.open').isVisible());
  await page.locator('.VPSidebar a[href$="/notes/midterm-2023"]').click();await page.waitForURL('**/notes/midterm-2023');await page.getByRole('heading',{name:'2023 密码学期中考试与解答',exact:false}).waitFor({state:'visible'});await page.locator('.vp-doc img').first().waitFor({state:'attached'});
  await page.goto(origin+notesHref('notes/root-finding'),{waitUntil:'networkidle'});assert.equal(await page.locator('.newton-demo').count(),1);assert.equal(await page.locator('.return-blog').getAttribute('href'),base);
  results.push('390px / 320px 手机阅读、章节切换及计算方法入口回归通过');
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await writeFile(shots+'/results.json',JSON.stringify({results,errors,failed},null,2));
  console.log(JSON.stringify({results,errors,failed},null,2));
}finally{await browser.close();}
