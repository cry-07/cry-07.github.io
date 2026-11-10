import test from 'node:test';
import assert from 'node:assert/strict';
import { stepNewton } from '../handouts/.vitepress/theme/newton.mjs';

test('Newton iteration converges to sqrt(2) and satisfies both tolerances', () => {
  let x = 1, result;
  for (let iteration = 0; iteration < 20; iteration++) {
    result = stepNewton({ functionId: 'square', x, tolerance: 1e-8, iteration, maxIterations: 20 });
    x = result.next;
    if (result.status !== 'running') break;
  }
  assert.equal(result.status, 'converged');
  assert.ok(Math.abs(x - Math.sqrt(2)) < 1e-8);
  assert.ok(result.residual <= 1e-8 && result.delta <= 1e-8);
});
test('a zero derivative away from the root stops without dividing by zero', () => {
  const r = stepNewton({ functionId: 'square', x: 0, tolerance: 1e-8, iteration: 0, maxIterations: 20 });
  assert.equal(r.status, 'derivative'); assert.equal(r.next, 0);
});
test('a two-cycle stops at the requested iteration limit', () => {
  let x = 0, r;
  for (let iteration = 0; iteration < 6; iteration++) {
    r = stepNewton({ functionId: 'cycle', x, tolerance: 1e-8, iteration, maxIterations: 6 }); x = r.next;
  }
  assert.equal(r.status, 'limit'); assert.equal(x, 0);
});
test('non-finite inputs and invalid settings are rejected', () => {
  assert.equal(stepNewton({ functionId: 'square', x: Infinity, tolerance: 1e-6, iteration: 0, maxIterations: 10 }).status, 'invalid');
  assert.equal(stepNewton({ functionId: 'square', x: 1, tolerance: 0, iteration: 0, maxIterations: 10 }).status, 'invalid');
});
test('an exact root is accepted even if its derivative vanishes', () => {
  const r = stepNewton({ functionId: 'cubic', x: 0, tolerance: 1e-8, iteration: 0, maxIterations: 10 });
  assert.equal(r.status, 'converged'); assert.equal(r.delta, 0);
});
test('overflow and very large iterates stop with a range explanation', () => {
  assert.equal(stepNewton({ functionId: 'cubic', x: 1e150, tolerance: 1e-8, iteration: 0, maxIterations: 10 }).status, 'range');
});
