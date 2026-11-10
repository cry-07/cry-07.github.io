<script setup>
import { computed, ref, onUnmounted } from 'vue';
import { examples, stepNewton } from './newton.mjs';
const functionId = ref('square'), initial = ref(1.8), tolerance = ref('0.000001'), maxIterations = ref(20);
const rows = ref([]), status = ref('ready'), message = ref('从一个猜测出发，沿着切线找到下一个近似值。'), playing = ref(false);
const example = computed(() => examples[functionId.value]);
const current = computed(() => rows.value.length ? rows.value.at(-1).next : Number(initial.value));
const last = computed(() => rows.value.at(-1));
let timer;
function stop() { clearTimeout(timer); playing.value = false; }
function reset() { stop(); rows.value = []; status.value = 'ready'; message.value = '从一个猜测出发，沿着切线找到下一个近似值。'; }
function changeFunction() { initial.value = example.value.initial; reset(); }
function step() {
  if (!['ready', 'running'].includes(status.value)) return;
  const r = stepNewton({ functionId: functionId.value, x: current.value, tolerance: Number(tolerance.value), iteration: rows.value.length, maxIterations: Number(maxIterations.value) });
  status.value = r.status; message.value = r.message;
  if (!['invalid', 'derivative', 'range'].includes(r.status)) rows.value.push(r);
  if (r.status !== 'running') stop();
}
function tick() { if (!playing.value) return; step(); if (playing.value) timer = setTimeout(tick, 550); }
function run() { if (playing.value) { stop(); return; } playing.value = true; tick(); }
onUnmounted(stop);
const format = value => Number.isFinite(value) ? (value === 0 ? '0' : Math.abs(value) < .0001 ? value.toExponential(3) : Number(value.toPrecision(8)).toString()) : '—';
const plot = computed(() => {
  const e = example.value, [xmin, xmax] = e.domain, [ymin, ymax] = e.range;
  const sx = x => 48 + (x - xmin) / (xmax - xmin) * 564, sy = y => 282 - (y - ymin) / (ymax - ymin) * 254;
  const curve = Array.from({ length: 241 }, (_, i) => { const x = xmin + (xmax - xmin) * i / 240; return `${i ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(e.f(x)).toFixed(2)}`; }).join(' ');
  const x = last.value?.x ?? current.value, y = e.f(x), d = e.df(x);
  const tangent = `M${sx(xmin)},${sy(y + d * (xmin - x))} L${sx(xmax)},${sy(y + d * (xmax - x))}`;
  return { curve, tangent, sx, sy, xmin, xmax, ymin, ymax, x, y };
});
const finished = computed(() => !['ready', 'running'].includes(status.value));
</script>
<template>
  <section class="newton-demo" aria-label="牛顿法交互演示">
    <div class="demo-heading"><span>INTERACTIVE LAB / 01</span><span>切线，给出下一步。</span></div>
    <div class="demo-controls">
      <label class="function-label">示例函数<select v-model="functionId" @change="changeFunction"><option v-for="(item, id) in examples" :key="id" :value="id">{{ item.label }}</option></select></label>
      <label>初值 x₀<input v-model.number="initial" type="number" step="0.1" @input="reset" /></label>
      <label>容差 ε<select v-model="tolerance" @change="reset"><option value="0.001">10⁻³</option><option value="0.000001">10⁻⁶</option><option value="0.00000001">10⁻⁸</option></select></label>
      <label>最大次数<input v-model.number="maxIterations" type="number" min="1" max="100" step="1" @input="reset" /></label>
    </div>
    <svg class="newton-plot" viewBox="0 0 640 320" role="img" :aria-label="`${example.formula} 的函数曲线、切线及当前迭代点；完整数值见下方表格。`">
      <defs><clipPath id="newton-clip"><rect x="48" y="28" width="564" height="254" /></clipPath></defs>
      <g class="plot-grid"><line v-for="i in 5" :key="'v'+i" :x1="48+i*94" :x2="48+i*94" y1="28" y2="282"/><line v-for="i in 4" :key="'h'+i" x1="48" x2="612" :y1="28+i*50.8" :y2="28+i*50.8"/></g>
      <g class="plot-axes"><line x1="48" x2="612" :y1="plot.sy(0)" :y2="plot.sy(0)"/><line :x1="plot.sx(0)" :x2="plot.sx(0)" y1="28" y2="282"/></g>
      <g clip-path="url(#newton-clip)">
        <path :d="plot.curve" fill="none" class="function-curve" />
        <path v-if="Number.isFinite(plot.y)" :d="plot.tangent" fill="none" class="tangent-curve" />
        <line v-if="last" :x1="plot.sx(last.next)" :x2="plot.sx(last.next)" :y1="plot.sy(0)" :y2="plot.sy(example.f(last.next))" class="iteration-line" />
        <circle v-for="(row, i) in rows" :key="i" :cx="plot.sx(row.next)" :cy="plot.sy(0)" r="3.5" class="past-point" />
        <circle v-if="Number.isFinite(plot.y)" :cx="plot.sx(plot.x)" :cy="plot.sy(plot.y)" r="5" class="current-point" />
        <circle v-if="last" :cx="plot.sx(last.next)" :cy="plot.sy(0)" r="5" class="next-point" />
      </g>
      <text x="50" y="16" class="plot-label">{{ example.formula }}</text><text x="48" y="308" class="plot-label">{{ plot.xmin }}</text><text x="600" y="308" class="plot-label">{{ plot.xmax }}</text><text x="620" :y="plot.sy(0)-8" class="plot-label">x</text>
    </svg>
    <div class="legend"><span class="blue-key">函数</span><span class="orange-key">当前切线</span><span class="point-key">下一近似值</span></div>
    <div class="demo-actions"><button class="primary" :disabled="finished || playing" @click="step">单步迭代 →</button><button :disabled="finished" @click="run">{{ playing ? '暂停' : '自动运行' }}</button><button @click="reset">重置</button></div>
    <p class="demo-status" :data-status="status" role="status" aria-live="polite">{{ message }}</p>
    <dl class="demo-metrics"><div><dt>当前近似值</dt><dd>{{ format(current) }}</dd></div><div><dt>残差 |f(x)|</dt><dd>{{ format(Math.abs(example.f(current))) }}</dd></div><div><dt>迭代差 |Δx|</dt><dd>{{ last ? format(last.delta) : '—' }}</dd></div></dl>
    <div v-if="rows.length" class="iteration-table" tabindex="0" aria-label="牛顿法迭代表格"><table><thead><tr><th>步数</th><th>xₖ</th><th>xₖ₊₁</th><th>残差</th><th>迭代差</th></tr></thead><tbody><tr v-for="(row, i) in rows" :key="i"><td>{{ i+1 }}</td><td>{{ format(row.x) }}</td><td>{{ format(row.next) }}</td><td>{{ format(row.residual) }}</td><td>{{ format(row.delta) }}</td></tr></tbody></table></div>
    <p class="demo-note">图窗固定，迭代点可能暂时落在窗外；以上方数值为准。停止标准为残差与迭代差均 ≤ ε。</p>
  </section>
</template>
<style scoped>
.newton-demo{border:1px solid var(--vp-c-divider);border-radius:12px;padding:24px;margin:28px 0;background:var(--vp-c-bg)}.demo-heading{display:flex;justify-content:space-between;gap:12px;font-size:11px;letter-spacing:.06em;color:var(--vp-c-text-2);border-bottom:1px solid var(--vp-c-divider);padding-bottom:16px}.demo-controls{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-top:20px}.demo-controls label{font-size:11px;color:var(--vp-c-text-2);display:flex;flex-direction:column;gap:5px}.demo-controls input,.demo-controls select{font:inherit;font-size:13px;width:100%;min-width:0;height:38px;border:1px solid var(--vp-c-divider);border-radius:5px;padding:0 9px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}.newton-plot{width:100%;height:auto;display:block;margin:28px 0 0;overflow:hidden}.plot-grid{stroke:var(--vp-c-divider);stroke-width:.7}.plot-axes{stroke:var(--vp-c-text-3);stroke-width:1}.function-curve{stroke:var(--vp-c-brand-1);stroke-width:2.7}.tangent-curve{stroke:#d18444;stroke-width:1.8;stroke-dasharray:7 4}.iteration-line{stroke:#809890;stroke-dasharray:3 3}.current-point{fill:var(--vp-c-brand-1);stroke:var(--vp-c-bg);stroke-width:2}.next-point{fill:#d18444;stroke:var(--vp-c-bg);stroke-width:2}.past-point{fill:#8e9bab}.plot-label{fill:var(--vp-c-text-2);font-size:12px}.legend{display:flex;gap:20px;justify-content:center;font-size:11px;color:var(--vp-c-text-2)}.legend span::before{content:"";display:inline-block;width:14px;height:2px;margin:0 6px 3px 0;background:var(--vp-c-brand-1)}.legend .orange-key::before{background:#d18444}.legend .point-key::before{border-radius:50%;height:5px;width:5px;background:#d18444}.demo-actions{display:flex;gap:10px;margin-top:24px}.demo-actions button{border:1px solid var(--vp-c-divider);border-radius:5px;padding:8px 14px;font-size:13px;cursor:pointer}.demo-actions button.primary{background:var(--vp-c-brand-3);color:#fff;border-color:var(--vp-c-brand-3)}.demo-actions button:disabled{opacity:.45;cursor:default}.demo-status{font-size:13px!important;color:var(--vp-c-text-2);margin-bottom:16px!important}.demo-status[data-status=converged]{color:#358166}.demo-status[data-status=derivative],.demo-status[data-status=limit],.demo-status[data-status=invalid],.demo-status[data-status=range]{color:#af6827}.demo-metrics{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--vp-c-divider);padding-top:16px;gap:12px}.demo-metrics dt{font-size:11px;color:var(--vp-c-text-2)}.demo-metrics dd{font-family:Consolas,monospace;font-size:18px;margin:6px 0 0;overflow-wrap:anywhere}.iteration-table{max-height:240px;overflow:auto;margin-top:20px}.iteration-table table{display:table;width:100%;margin:0;font-size:12px}.iteration-table th,.iteration-table td{padding:6px 10px;white-space:nowrap}.demo-note{font-size:11px!important;color:var(--vp-c-text-2);margin-bottom:0!important}@media(max-width:640px){.newton-demo{padding:16px}.demo-controls{grid-template-columns:1fr 1fr}.function-label{grid-column:1/-1}.demo-heading{flex-wrap:wrap}.demo-metrics dd{font-size:14px}.demo-actions button{padding:8px 10px;font-size:12px}}
</style>
