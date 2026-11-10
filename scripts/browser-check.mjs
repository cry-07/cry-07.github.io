import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { base } from '../site.config.mjs';
import { chapters } from '../chapters.mjs';
import { cryptoChapters } from '../crypto-chapters.mjs';
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173';
const shots = process.env.SCREENSHOT_DIR || '../../work/browser-check';
await mkdir(shots, { recursive: true });
const executablePath = process.env.BROWSER_PATH || (process.platform === 'win32' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const errors = [], requests = [], results = [];
const context = await browser.newContext({ viewport: { width:1440,height:1000 }, colorScheme:'light', reducedMotion:'reduce' });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if(response.status() >= 400) requests.push(`${response.status()} ${response.url()}`); });
async function checkWidth(name) { const w=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:innerWidth})); assert.ok(w.body <= w.viewport+1,`${name}: 页面横向溢出 ${JSON.stringify(w)}`); results.push(`${name}: no horizontal overflow`); }
try {
  await page.goto(origin+base, { waitUntil:'networkidle' });
  assert.equal(await page.locator('.entry:visible').count(),chapters.length+cryptoChapters.length);
  await page.screenshot({path:shots+'/home-desktop.png',fullPage:false});
  await checkWidth('desktop home');
  await page.getByRole('button',{name:'文章随笔 00'}).click();
  assert.ok(await page.locator('#empty-state').isVisible());
  await page.locator('#clear-filters').click();
  await page.locator('#entry-search').fill('傅里叶');
  assert.equal(await page.locator('.entry:visible').count(),1);
  await page.locator('#entry-search').fill('no-such-entry');
  assert.ok(await page.locator('#empty-state').isVisible());
  await page.locator('#clear-filters').click();
  await page.locator('[data-topic="插值与逼近"]').click();
  assert.equal(await page.locator('.entry:visible').count(),3);
  await page.locator('[data-topic="插值与逼近"]').click();
  await page.locator('#theme-toggle').click();
  assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
  await page.reload(); assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
  await page.locator('#theme-toggle').click();
  results.push('home: filters, search, empty state, persisted theme');

  await page.goto(origin+base+'numerical-methods/',{waitUntil:'networkidle'});
  await page.screenshot({path:shots+'/course-desktop.png',fullPage:true});
  await checkWidth('desktop course');
  assert.equal(await page.locator('.chapter-card').count(),9);
  assert.equal(await page.locator('.return-blog').getAttribute('href'),base);
  await page.getByRole('button',{name:'搜索讲义',exact:true}).click();
  await page.locator('#localsearch-input').fill('奇异值');
  await page.locator('.VPLocalSearchBox .results a').first().waitFor({state:'visible',timeout:15000});
  assert.ok((await page.locator('.VPLocalSearchBox').innerText()).includes('奇异值'));
  await page.locator('#localsearch-input').fill('zzzznotfoundzzzz');
  await page.locator('.VPLocalSearchBox').getByText('没有找到相关内容，试试其他关键词。',{exact:false}).waitFor({state:'visible'});
  await page.keyboard.press('Escape');
  results.push('course: full-text search results, no-results, Escape');

  for(const c of chapters){
    await page.goto(origin+base+'numerical-methods/notes/'+c.slug,{waitUntil:'networkidle'});
    await checkWidth('desktop '+c.slug);
    const math=await page.locator('.vp-doc mjx-container').count(); assert.ok(math>20,`${c.slug} 公式未渲染`);
    assert.equal(await page.locator('mjx-merror').count(),0);
    assert.equal(await page.locator('.vp-doc').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('mjx-container,code,script,style').forEach(n=>n.remove());return (copy.textContent.match(/\$/g)||[]).length}),0,`${c.slug} 含未渲染公式标记`);
    assert.equal(await page.locator('.vp-doc img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).length),0);
  }
  await page.goto(origin+base+'numerical-methods/notes/root-finding',{waitUntil:'networkidle'});
  const demo=page.locator('.newton-demo'); await demo.scrollIntoViewIfNeeded();
  await page.screenshot({path:shots+'/newton-desktop.png'});
  await demo.getByRole('button',{name:'单步迭代 →'}).click(); assert.equal(await demo.locator('tbody tr').count(),1);
  await demo.getByRole('button',{name:'自动运行',exact:true}).click();
  await demo.locator('[data-status="converged"]').waitFor({state:'visible',timeout:15000});
  await demo.getByRole('button',{name:'重置',exact:true}).click(); assert.equal(await demo.locator('tbody tr').count(),0);
  await demo.locator('input[type="number"]').first().fill('0');
  await demo.getByRole('button',{name:'单步迭代 →'}).click();
  assert.ok(await demo.locator('[data-status="derivative"]').isVisible());
  await demo.locator('select').first().selectOption('cycle');
  await demo.locator('input[type="number"]').nth(1).fill('2');
  await demo.getByRole('button',{name:'单步迭代 →'}).click();
  await demo.getByRole('button',{name:'单步迭代 →'}).click();
  assert.ok(await demo.locator('[data-status="limit"]').isVisible());
  results.push('Newton: step, run, convergence, reset, derivative-zero, cycle limit');
  const image=page.locator('.vp-doc img').first(); await image.focus(); await page.keyboard.press('Enter');
  await page.locator('dialog[open]').waitFor({state:'visible'}); await page.keyboard.press('Escape');
  assert.ok(await image.evaluate(el=>el===document.activeElement));
  results.push('images: keyboard zoom, Escape, focus restored');
  await page.goto(origin+base+'about/',{waitUntil:'networkidle'}); assert.ok((await page.title()).includes('关于这里'));
  const notFound=await page.goto(origin+base+'does-not-exist'); assert.equal(notFound.status(),404);
  results.push('about and HTTP 404');

  await page.setViewportSize({width:390,height:844});
  for(const [name,path] of [['home',''],['course','numerical-methods/'],['root-finding','numerical-methods/notes/root-finding'],['svd','numerical-methods/notes/svd']]){
    await page.goto(origin+base+path,{waitUntil:'networkidle'});
    await checkWidth('mobile '+name);
    await page.screenshot({path:shots+'/'+name+'-mobile.png',fullPage:name==='home'||name==='course'});
  }
  await page.getByRole('button',{name:'章节目录',exact:true}).click();
  assert.ok(await page.locator('.VPSidebar.open').isVisible());
  await page.locator('.VPSidebar a[href$="/notes/root-finding"]').click();
  await page.waitForURL('**/notes/root-finding');
  await page.locator('.newton-demo').waitFor({state:'attached'});
  results.push('mobile: chapter navigation');
  await page.setViewportSize({width:320,height:700});
  for(const path of ['', 'numerical-methods/', 'numerical-methods/notes/root-finding','numerical-methods/notes/svd']){await page.goto(origin+base+path,{waitUntil:'networkidle'}); await checkWidth('320px '+path);}
  assert.deepEqual(errors,[],'browser JavaScript errors');
  assert.equal(requests.filter(s=>!s.includes('does-not-exist')).length,0,'failed requests: '+requests.join('\n'));
  console.log(JSON.stringify({results,errors,requests},null,2));
  await writeFile(shots+'/results.json',JSON.stringify({results,errors,requests},null,2));
} catch(error){console.error('Browser errors:',errors,'Requests:',requests);throw error;} finally{await browser.close();}
