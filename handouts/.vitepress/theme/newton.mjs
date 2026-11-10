export const examples = {
  square: { label: 'x² − 2：寻找 √2', formula: 'f(x) = x² − 2', f: x => x * x - 2, df: x => 2 * x, initial: 1.8, domain: [-2.5, 2.5], range: [-3, 5] },
  cosine: { label: 'cos(x) − x：不动点', formula: 'f(x) = cos(x) − x', f: x => Math.cos(x) - x, df: x => -Math.sin(x) - 1, initial: 2, domain: [-2, 3], range: [-4, 3] },
  cycle: { label: 'x³ − 2x + 2：观察循环', formula: 'f(x) = x³ − 2x + 2', f: x => x ** 3 - 2 * x + 2, df: x => 3 * x * x - 2, initial: 0, domain: [-2.5, 2], range: [-5, 6] },
  cubic: { label: 'x³：重根与慢收敛', formula: 'f(x) = x³', f: x => x ** 3, df: x => 3 * x * x, initial: 1.5, domain: [-2, 2], range: [-5, 5] },
};
export function stepNewton({ functionId, x, tolerance, iteration, maxIterations }) {
  const fn = examples[functionId];
  const result = (status, message, next = x, delta = 0) => ({ x, next, delta, residual: fn ? Math.abs(fn.f(next)) : NaN, status, message });
  if (!fn || !Number.isFinite(x) || !(tolerance > 0 && tolerance <= 1) || !Number.isInteger(maxIterations) || maxIterations < 1 || !Number.isInteger(iteration) || iteration < 0) return result('invalid', '请输入有效初值、正容差与正整数迭代次数。');
  const y = fn.f(x), derivative = fn.df(x);
  if (!Number.isFinite(y) || !Number.isFinite(derivative) || Math.abs(x) > 1e8) return result('range', '数值超出安全演示范围，请调整初值。');
  if (y === 0) return result('converged', '当前值已是方程的根，残差与迭代差均为 0。');
  if (Math.abs(derivative) < 1e-12) return result('derivative', '导数过小，切线无法给出可靠的下一步。请调整初值。');
  if (iteration >= maxIterations) return result('limit', '已达到最大迭代次数，尚未同时满足两项精度要求。');
  const next = x - y / derivative, delta = Math.abs(next - x), residual = Math.abs(fn.f(next));
  if (!Number.isFinite(next) || !Number.isFinite(residual) || Math.abs(next) > 1e8) return result('range', '迭代值超出安全演示范围，请调整初值。');
  if (residual <= tolerance && delta <= tolerance) return result('converged', '已收敛：残差和相邻迭代差均不超过容差。', next, delta);
  if (iteration + 1 >= maxIterations) return result('limit', '已达到最大迭代次数，尚未同时满足两项精度要求。', next, delta);
  return result('running', '切线与横轴的交点，成为下一次的近似值。', next, delta);
}
